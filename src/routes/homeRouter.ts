import express, { Router, RequestHandler } from "express";

const homeRouter = Router();

const homeRoute: RequestHandler = (req, res) => {
  res.send("Welcome HTML!");
}; // TEST

const homeRouteApi: RequestHandler = (req, res) => {
  res.json({ msg: "Welcome JSON!" });
};

homeRouter.get("/", homeRoute);
homeRouter.get("/api", homeRouteApi);

export default homeRouter;
