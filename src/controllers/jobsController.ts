import express, { RequestHandler } from "express";
import Job, { JobInterface } from "../models/Job.js";
import { StatusCodes } from "http-status-codes";

export const createJob: RequestHandler<{}, {}, JobInterface> = async (
  req,
  res,
  next
) => {
  req.body.createdBy = req.user.userId; // attach userId (taken from auth middleware)

  try {
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } catch (e) {
    next(e);
  }
};

export const deleteJob: RequestHandler = async (req, res) => {
  res.send("deleteJob");
};

export const getAllJobs: RequestHandler = async (req, res) => {
  res.send("getAllJobs");
};

export const updateJob: RequestHandler = async (req, res) => {
  res.send("updateJob");
};

export const showStats: RequestHandler = async (req, res) => {
  res.send("showStats");
};
