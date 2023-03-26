import express, { NextFunction, RequestHandler } from "express";
import User, { UserInterface } from "../models/User.js";
import { StatusCodes } from "http-status-codes";

export const register: RequestHandler<{}, {}, UserInterface> = async (
  req,
  res,
  next
) => {
  // const body: UserInterface = req.body;
  const { body } = req; // type assigned with 'RequestHandler' generic

  try {
    const user = await User.create(body);
    res.status(StatusCodes.CREATED).json(user);
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
