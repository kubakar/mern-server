import { Types } from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      // user: { userId: object };
      user: { userId: Types.ObjectId };
    }
  }
}
