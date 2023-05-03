import mongoose, { Schema, model, Types } from "mongoose";

// Document interface
export interface JobInterface {
  company: string;
  position: string;
  status: string;
  jobType: string;
  jobLocation: string;
  createdBy: Types.ObjectId;
}

// Schema
const schema = new Schema<JobInterface>(
  {
    company: {
      type: String,
      required: [true, "Please provide company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "My city",
      required: true,
    },
    createdBy: {
      // https://mongoosejs.com/docs/typescript.html
      type: Schema.Types.ObjectId,
      ref: "User", // relation to 'User' DB
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true } // automatically add time realted fields
);

export default model<JobInterface>("Job", schema); // 'UserModel' is passed to have methods in the instance
