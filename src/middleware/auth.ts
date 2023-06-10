import { Router, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomAPIError } from "../utils/error.js";
import { Types } from "mongoose";

type customJwtPayload = {
  userId: Types.ObjectId;
};

export const validateUserForm: RequestHandler = (req, res, next) => {
  // const body: UserInterface = req.body;
  const { email, password } = req.body;

  // controller validation (prior to DB validation) for both login & register
  if (!email || !password)
    throw new CustomAPIError(
      "Please provide all values (user)", // throw custom error
      StatusCodes.BAD_REQUEST
    );

  next();
};

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader); // old
  console.log(req.cookies); // new

  // Change JSON token to cookie token
  /*
  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new CustomAPIError(
      "Auth. Invalid (no token!)",
      StatusCodes.UNAUTHORIZED
    );

  const token = authHeader.split(" ")[1]; // Bearer [token]
  */
  const { token } = req.cookies;

  if (!token)
    throw new CustomAPIError(
      "Auth. Invalid (no token!)",
      StatusCodes.UNAUTHORIZED
    );

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string); // this method throws error when token invalid

    // attach 'user' to middleware in this middleware (into next)
    req.user = { userId: (payload as customJwtPayload).userId };
    // will be used in all other calls

    next();
  } catch (error) {
    throw new CustomAPIError(
      "Auth. Invalid (bad token!)",
      StatusCodes.UNAUTHORIZED
    );
  }
};
