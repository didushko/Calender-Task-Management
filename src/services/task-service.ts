import DatabaseConnection from "@/database/DatabaseConnetion";
import taskModel from "../database/models/task-model";

class TaskService extends DatabaseConnection {
  async get(id: string) {
    const task = await taskModel.findOne({ _id: id });
    if (!task) {
      return null;
    }
    return task.toObject();
  }

  async add(title: string) {
    const task = await taskModel.create({ title });
    if (!task) {
      return null;
    }
    return task.toObject();
  }
  async update(id: string, title: string) {
    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: id },
      { title },
      { new: true }
    );
    if (!updatedTask) {
      return null;
    }
    return updatedTask.toObject();
  }

  async delete(taskId: string) {
    const deleteResult = await taskModel.deleteOne({ _id: taskId });
    if (!deleteResult.deletedCount) {
      return false;
    }
    return true;
  }
}

const taskService = new TaskService();

export default taskService;
