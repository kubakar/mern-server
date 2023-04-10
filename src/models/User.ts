import mongoose, { Model, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  lastName?: string;
  location?: string;
}

interface UserInterfaceDocument extends UserInterface {
  _id?: any;
}

// Put all user instance methods in this interface:
interface UserInterfaceMethods {
  test: () => boolean;
  createJWT: () => string;
  comparePassword: (pass: string) => Promise<boolean>;
}

// Create a new Model type that knows about UserInterfaceMethods
type UserModel = Model<UserInterface, {}, UserInterfaceMethods>;

const UserSchema = new Schema<UserInterface, UserModel>({
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
    select: false, // will be not given back in response when queries are issued
    // BUT will be still given back on 'user.create()'
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

// https://mongoosejs.com/docs/middleware.html
// mongoose middleware (pre and post hooks)
// 'save' is not triggered but every method! (eg. 'findOneAndUpate' will not trigger that hook)
// is triggered on .create() method
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // password hashing

  // Store hash in your password DB ??
});

// https://mongoosejs.com/docs/guide.html#methods
// https://mongoosejs.com/docs/typescript/statics-and-methods.html

// UserSchema.methods.createJWT = function () {
//   console.log(this);
// };

// https://stackoverflow.com/questions/36311284/is-there-a-way-to-extract-the-type-of-typescript-interface-property
const test: UserInterfaceMethods["test"] = function (
  this: UserInterfaceDocument
) {
  console.log(this._id);
  return true;
};

const createJWT: UserInterfaceMethods["createJWT"] = function (
  this: UserInterfaceDocument
) {
  // _id will be accessible on the user instance
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

const comparePassword: UserInterfaceMethods["comparePassword"] =
  async function (this: UserInterfaceDocument, inputPassword) {
    const isMatch = await bcrypt.compare(inputPassword, this.password);
    return isMatch;
  };

UserSchema.method("test", test);
UserSchema.method("createJWT", createJWT);
UserSchema.method("comparePassword", comparePassword);

export default model<UserInterface, UserModel>("User", UserSchema); // 'UserModel' is passed to have methods in the instance
