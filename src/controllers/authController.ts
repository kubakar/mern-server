import { NextFunction, RequestHandler } from "express";
import User, { UserInterface } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./error.js";

export const validateRegister: RequestHandler = (req, res, next) => {
  // const body: UserInterface = req.body;
  const { body } = req; // type assigned with 'RequestHandler' generic
  const { name, email, password } = body;

  // controller validation (prior to DB validation)
  if (!name || !email || !password) {
    throw new CustomAPIError(
      "Please provide all values", // throw custom error
      StatusCodes.BAD_REQUEST
    );
  }
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

    // create JWT token
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
      },

      location: user.location,
      token,
    });
  } catch (error) {
    next(error); // pass error to express error handler
  }
};

export const login: RequestHandler = async (req, res) => {
  res.send("login");
};

export const updateUser: RequestHandler = async (req, res) => {
  res.send("updateUser");
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find(); // get all users

    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error); // pass error to express error handler
  }
};
