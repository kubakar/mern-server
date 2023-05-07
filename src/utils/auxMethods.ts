import { Types } from "mongoose";
import { CustomAPIError } from "./error.js";
import { StatusCodes } from "http-status-codes";

Types;

export const checkPermission = (
  requestUser: { userId: Types.ObjectId },
  resourceUserId: Types.ObjectId
) => {
  console.log(
    requestUser.userId.toString() + " <=> " + resourceUserId.toString()
  );

  //   if (requestUser.role === 'admin') return; // admin can do all

  if (requestUser.userId.toString() === resourceUserId.toString()) return;

  throw new CustomAPIError(
    `Not auth. to access this resource`, // throw custom error
    StatusCodes.UNAUTHORIZED
  );
};
