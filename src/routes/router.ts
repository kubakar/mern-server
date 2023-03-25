import express, { Router, RequestHandler } from "express";
const router = Router();

const homeRoute: RequestHandler = (req, res) => {
  res.send("Welcome!");
};

router.get("/", homeRoute);

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
  res.status(500).json({ msg: "ERROR!" });
};

export default router; // compiled to '.exports' by TS
