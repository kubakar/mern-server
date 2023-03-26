import mongoose, { Schema, model } from "mongoose";
import validator from "validator";

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  lastName?: string;
  location?: string;
}

const UserSchema = new Schema<UserInterface>({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 20,
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true, // only one can exists in DB (can be also done inside controller)
    // custom validator from mongoose
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: "Def. Surname",
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: "My City",
  },
});

export default model<UserInterface>("User", UserSchema);
