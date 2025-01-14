"use server";

import { ITask } from "@/database/models/task-model";
import logger from "@/logger/logger";
import dailyListService from "@/services/dailyList-service";
import taskService from "@/services/task-service";
import mongoose from "mongoose";

export async function addTaskAction(date: Date, title: string) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const task = await taskService.add(title);
    if (task) {
      const list = await dailyListService.addTask(date, task._id);
      await session.commitTransaction();
      return list;
    }
    throw new Error("Failed to add task");
  } catch (e: unknown) {
    logger.error(String(e));
    await session.abortTransaction();
    return null;
  } finally {
    session.endSession();
  }
}

export async function editTaskAction(date: Date, task: ITask) {
  try {
    const updated = await taskService.update(task._id, task.title);
    if (updated) {
      return updated;
    }
  } catch (e: unknown) {
    logger.error(String(e));
    return null;
  }
}

export async function deleteTaskAction(date: Date, taskId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const dailyList = await dailyListService.deleteTask(date, taskId, session);
    if (!dailyList) {
      throw new Error(`Failed to fint daily list for task ${taskId}`);
    }
    const task = await taskService.delete(taskId);
    if (!task) {
      throw new Error(`Failed to delete task ${taskId} from list date ${date}`);
    }
    await session.commitTransaction();
    session.endSession();
    return dailyList;
  } catch (e: unknown) {
    logger.error(String(e));
    await session.abortTransaction();
    session.endSession();
    return null;
  }
}
