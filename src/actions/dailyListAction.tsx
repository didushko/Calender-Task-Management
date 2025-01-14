"use server";

import { IDailyTaskList } from "@/database/models/dailyTaskList-model";
import logger from "@/logger/logger";
import dailyListService from "@/services/dailyList-service";
import mongoose from "mongoose";

export async function updateTaskListsAction(taskLists: IDailyTaskList[]) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const results = [];
    for (const list of taskLists) {
      const res = await dailyListService.updateTaskList(list, session);
      if (!res) {
        throw new Error(`Failed to update task list ${list._id}`);
      }
      results.push(res);
    }
    await session.commitTransaction();
    return results;
  } catch (e: unknown) {
    await session.abortTransaction();
    logger.error(String(e));
    return null;
  } finally {
    session.endSession();
  }
}
