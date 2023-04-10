import { NextFunction, RequestHandler } from "express";

import User, { UserInterface } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./error.js";

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

export const register: RequestHandler<{}, {}, UserInterface> = async (
  req,
  res,
  next
) => {
  const { body } = req; // type assigned with 'RequestHandler' generic

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
