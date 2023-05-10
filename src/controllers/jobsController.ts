import { RequestHandler } from "express";
import Job, { JobInterface } from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { CustomAPIError } from "../utils/error.js";
import { checkPermission } from "../utils/auxMethods.js";

export const createJob: RequestHandler<object, object, JobInterface> = async (
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

export const getAllJobs: RequestHandler = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId });

    // const jobs = await Job.find({ createdBy: req.user.userId }).populate(
    //   "createdBy"
    // ); // JOIN user data

    res.status(StatusCodes.OK).json({ jobs, count: jobs.length, pages: 1 });
  } catch (e) {
    next(e);
  }
};

export const deleteJob: RequestHandler<
  { id?: Types.ObjectId }, // optional because of middleware chaining (.patch(validateJobsForm, updateJob);)
  object,
  JobInterface
> = async (req, res, next) => {
  const { id: jobId } = req.params;

  console.log(jobId);

  try {
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      throw new CustomAPIError(
        `No job with id ${jobId}`, // throw custom error
        StatusCodes.NOT_FOUND
      );
    }
    // check perm
    checkPermission(req.user, job.createdBy);

    await job.deleteOne();

    // ALTERNATIVE : await Job.findOneAndDelete({ _id: jobId });
    res.status(StatusCodes.OK).json({ id: job._id });
  } catch (e) {
    next(e);
  }
};

export const updateJob: RequestHandler<
  { id?: Types.ObjectId }, // optional because of middleware chaining (.patch(validateJobsForm, updateJob);)
  object,
  JobInterface
> = async (req, res, next) => {
  const { id: jobId } = req.params;
  // const { company, position } = req.body;

  try {
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      throw new CustomAPIError(
        `No job with id ${jobId}`, // throw custom error
        StatusCodes.NOT_FOUND
      );
    }

    // check perm
    checkPermission(req.user, job.createdBy);

    const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
      new: true, // return updated
      runValidators: true,
    }); // this not triggers any mongoose hook

    // ALTERNATIVE : Job.findOne() => assign new values/data => await job.save()

    res.status(StatusCodes.OK).json({ ...updatedJob?.toObject() });
  } catch (e) {
    next(e);
  }
};

export const showStats: RequestHandler = async (req, res) => {
  res.send("showStats");
};
