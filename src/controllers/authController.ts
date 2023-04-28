import { NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User, { UserInterface } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./error.js";

// middlewares
export const validateUserForm: RequestHandler = (req, res, next) => {
  // const body: UserInterface = req.body;
  const { email, password } = req.body;

  // controller validation (prior to DB validation) for both login & register
  if (!email || !password)
    throw new CustomAPIError(
      "Please provide all values (server)", // throw custom error
      StatusCodes.BAD_REQUEST
    );

  next();
};

type customJwtPayload = {
  userId: string;
};

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new CustomAPIError(
      "Auth. Invalid (no token!)",
      StatusCodes.UNAUTHORIZED
    );

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string); // this method throws error when token invalid
    req.user = { userId: (payload as customJwtPayload).userId }; // attach 'user' to middleware in this middleware (into next)
    next();
  } catch (error) {
    throw new CustomAPIError(
      "Auth. Invalid (bad token!)",
      StatusCodes.UNAUTHORIZED
    );
  }
};

// controllers
export const register: RequestHandler<{}, {}, UserInterface> = async (
  req,
  res,
  next
) => {
  const { body } = req; // type assigned with 'RequestHandler' generic (UserInterface)

  try {
    const user = await User.create(body);

    // do not send token in register - individual approach
    const { password: pass, ...partialUser } = user.toObject(); // do not send password

    res.status(StatusCodes.CREATED).json({
      user: partialUser,
    });
  } catch (e) {
    next(e); // pass error to express error handler
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password"); // password is hidden by default

    if (!user)
      throw new CustomAPIError(
        "Invalid Credentials (no such user)", // throw custom error
        StatusCodes.UNAUTHORIZED
      );

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid)
      throw new CustomAPIError(
        "Invalid Credentials (invalid pass)", // throw custom error
        StatusCodes.UNAUTHORIZED
      );

    // 'toObject()' is necessary in order to get only keys (not Document object)
    const { password: pass, ...partialUser } = user.toObject(); // do not send password
    console.log(partialUser);

    const token = user.createJWT(); // setup the token

    res.status(StatusCodes.OK).json({
      user: partialUser,
      token,
    });
  } catch (e) {
    next(e);
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  console.log(req.user); // user is already passed here
  res.send("updateUser");
};

export const getUsers: RequestHandler = async (req, res, next) => {
  // https://expressjs.com/en/guide/error-handling.html

  try {
    const users = await User.find(); // get all users

    setTimeout(() => {
      res.status(StatusCodes.OK).json(users);
    }, 2000);
  } catch (e) {
    next(e); // pass error to express error handler
  }
};
