import { Response } from "express";

import { Types } from "mongoose";
import { CustomAPIError } from "./error.js";
import { StatusCodes } from "http-status-codes";

export const checkPermission = (
  requestUser: { userId: Types.ObjectId },
  resourceUserId: Types.ObjectId
) => {
  console.log(
    requestUser.userId.toString() + " <=> " + resourceUserId.toString()
  );

  if (requestUser.userId.toString() === resourceUserId.toString()) return;

  throw new CustomAPIError(
    `Not auth. to access this resource`, // throw custom error
    StatusCodes.UNAUTHORIZED
  );
};

export const attachCookie = (res: Response, token: string) => {
  const oneDay = 1000 * 60 * 60 * 24; // ms

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
  // A cookie with the HttpOnly attribute is inaccessible to the JavaScript Document.cookie API; it's only sent to the server.

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
};
