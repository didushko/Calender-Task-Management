import mongoose, { Schema, model, Model } from "mongoose";
import { ITask } from "./task-model";

export interface IDailyTaskList {
  _id: string;
  date: Date;
  tasks: {
    _id: string;
    task: ITask;
    priority: number;
  }[];
}

const DailyTaskListSchema = new Schema<IDailyTaskList>(
  {
    date: { type: Date, required: true },
    tasks: [
      {
        task: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
          required: true,
        },
        priority: { type: Number, required: true },
      },
    ],
  },
  {
    toObject: {
      transform: (doc, ret) => {
        if (ret._id) {
          ret._id = `${ret._id}`;
        }
        ret.tasks.forEach((task: ITask) => {
          task._id = `${task._id}`;
        });
        return ret;
      },
    },
  }
);

const DailyTaskListModel: Model<IDailyTaskList> =
  mongoose?.models?.DailyTaskList ||
  model("DailyTaskList", DailyTaskListSchema);
export default DailyTaskListModel;
