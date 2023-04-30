import express, { Router, RequestHandler } from "express";

import { StatusCodes } from "http-status-codes";

// no route
export const notFoundMiddleware: express.RequestHandler = (req, res) => {
  return res.status(404).json("Page is not there! 404");
};

type ErrorType = {
  name?: string;
  message?: string;
  errors?: object;
  code?: number;
  keyValue?: object;
  statusCode?: number;
};

// error
export const errorMiddleware: express.ErrorRequestHandler = (
  err: ErrorType,
  req,
  res,
  next
) => {
  console.log(err.statusCode);
  const defaultError = {
    statusCode: err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR, // 'statusCode' is taken from CustomAPIError
    msg: err.message ?? "Server Error !!",
  };

  // validation errors (mongo)
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = err.message ?? "validation error";
  }

  if (err.code === 11000 && err.keyValue) {
    // unique field duplicate
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    const key = Object.keys(err.keyValue);
    defaultError.msg = `${key} field has to be unique.`;
  }

  // return
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
  // res.status(defaultError.statusCode).json({ msg: err.message });
};
