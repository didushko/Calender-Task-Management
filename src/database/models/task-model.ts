import mongoose, { Schema, model, Model } from "mongoose";

export interface ITask {
  _id: string;
  title: string;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
  },
  {
    toObject: {
      transform: (doc, ret) => {
        if (ret._id) {
          ret._id = `${ret._id}`;
        }
        return ret;
      },
    },
  }
);

const TaskModel: Model<ITask> =
  mongoose?.models?.Task || model("Task", TaskSchema);
export default TaskModel;
