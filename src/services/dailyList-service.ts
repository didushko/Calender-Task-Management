import mongoose from "mongoose";
import dailyTaskListModel, {
  IDailyTaskList,
} from "../database/models/dailyTaskList-model";
import DatabaseConnection from "@/database/DatabaseConnetion";
import logger from "@/logger/logger";
import TaskModel from "@/database/models/task-model";

class DailyListService extends DatabaseConnection {
  async getTasks(date: Date) {
    const list = await dailyTaskListModel.findOne({ date });
    if (!list) {
      return null;
    }
    return list.toObject();
  }

  async getDailyTaskLists(
    startDate: Date,
    endDate: Date,
    search?: string
  ): Promise<IDailyTaskList[]> {
    try {
      const populdateParams: mongoose.PopulateOptions = {
        path: "tasks.task",
        model: TaskModel,
      };
      if (search) {
        populdateParams.match = {
          title: { $regex: search, $options: "i" },
        };
      }

      const dailyTaskLists = await dailyTaskListModel
        .find({
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate(populdateParams);
      dailyTaskLists.forEach((list) => {
        list.tasks.sort((a, b) => a.priority - b.priority);
      });
      return dailyTaskLists.map((list) => list.toObject());
    } catch (error) {
      logger.error("Error fetching daily task lists: " + error);
      throw error;
    }
  }

  async addTask(
    date: Date,
    id: string,
    priority: number = 0,
    session?: mongoose.ClientSession
  ) {
    const currentSession = session || (await mongoose.startSession());
    let sessionStarted = false;

    if (!session) {
      sessionStarted = true;
      currentSession.startTransaction();
    }

    try {
      await dailyTaskListModel.updateOne(
        { date },
        {
          $inc: { "tasks.$[task].priority": 1 },
        },
        {
          arrayFilters: [{ "task.priority": { $gte: priority } }],
          session: currentSession,
        }
      );

      const result = await dailyTaskListModel
        .findOneAndUpdate(
          { date },
          {
            $setOnInsert: { date },
            $push: {
              tasks: {
                task: id,
                priority: priority,
              },
            },
          },
          {
            upsert: true,
            new: true,
            session: currentSession,
          }
        )
        .populate({
          path: "tasks.task",
          model: TaskModel,
        });

      if (sessionStarted) {
        await currentSession.commitTransaction();
      }
      return result.toObject();
    } catch (error) {
      if (sessionStarted) {
        await currentSession.abortTransaction();
      }
      throw error;
    } finally {
      if (sessionStarted) {
        currentSession.endSession();
      }
    }
  }

  async deleteTask(
    date: Date,
    taskId: string,
    session?: mongoose.ClientSession
  ) {
    const result = await dailyTaskListModel.updateOne(
      { date },
      {
        $pull: {
          tasks: { task: taskId },
        },
      },
      {
        session,
      }
    );
    await dailyTaskListModel.updateMany(
      { date, "tasks.priority": { $gt: 0 } },
      {
        $inc: {
          "tasks.$.priority": -1,
        },
      },
      {
        arrayFilters: [{ "task.priority": { $gt: 0 } }],
        session,
      }
    );
    return result.modifiedCount > 0;
  }

  async moveTask(
    oldDate: Date,
    newDate: Date,
    taskId: string,
    priority: number
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const added = await this.addTask(newDate, taskId, priority, session);
      if (!added) {
        throw new Error("Failed to add task to the new date");
      }

      const deleted = await this.deleteTask(oldDate, taskId, session);
      if (!deleted) {
        throw new Error("Failed to delete task from the old date");
      }

      await session.commitTransaction();
      session.endSession();

      return added;
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      logger.error(String(e));
      return null;
    }
  }

  async changePriority(
    date: Date,
    taskId: string,
    priority: number,
    oldPriority: number
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const increment = oldPriority < priority ? -1 : 1;
      const start = Math.min(oldPriority, priority);
      const end = Math.max(oldPriority, priority);
      await dailyTaskListModel.updateOne(
        { date: date },
        {
          $inc: { "tasks.$[taskToAdjust].priority": increment },
        },
        {
          arrayFilters: [
            {
              $and: [
                { "taskToAdjust.priority": { $gte: start, $lte: end } },
                { "taskToAdjust.task": { $ne: taskId } },
              ],
            },
          ],
          session,
        }
      );
      const res = await dailyTaskListModel
        .findOneAndUpdate(
          { date: date, "tasks.task": taskId },
          { $set: { "tasks.$.priority": priority } },
          {
            session,
            returnDocument: "after",
            new: true,
          }
        )
        .populate({
          path: "tasks.task",
          model: TaskModel,
        });
      if (!res) {
        throw new Error("Failed to move task");
      }

      await session.commitTransaction();
      session.endSession();
      return res.toObject();
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      logger.error(String(e));
      return null;
    }
  }

  async updateTaskList(
    dailyTaskList: IDailyTaskList,
    session: mongoose.ClientSession
  ) {
    const { _id, ...taskToUpdate } = dailyTaskList;
    try {
      const updated = await dailyTaskListModel
        .findOneAndUpdate(
          { date: dailyTaskList.date },
          { $set: taskToUpdate },
          { upsert: true, new: true, session }
        )
        .populate({
          path: "tasks.task",
          model: TaskModel,
        });
      return updated.toObject();
    } catch (e) {
      logger.error(`Error update list ${_id} ${String(e)}`);
      return null;
    }
  }
}
const dailyListService = new DailyListService();

export default dailyListService;
