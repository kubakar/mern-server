import express, { Router, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const homeRouter = Router();

const homeRoute: RequestHandler = (req, res) => {
  res.send("Welcome!");
};

homeRouter.get("/", homeRoute);

// no route
export const notFoundMiddleware: express.RequestHandler = (req, res) => {
  return res.status(404).json("Page is not there! 404");
};

// error
export const errorMiddleware: express.ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.log(err);
  const defaultError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: "Server Error !!",
  };
  res.status(defaultError.statusCode).json({ msg: err });
};

export default homeRouter; // compiled to '.exports' by TS
