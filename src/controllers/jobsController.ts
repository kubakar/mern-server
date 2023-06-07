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

type SortType = "latest" | "oldest" | "az" | "za";

export const getAllJobs: RequestHandler<
  object,
  object,
  object,
  {
    status?: string;
    search?: string;
    type?: string;
    sort?: SortType;
    page?: number;
    limit?: number;
  }
> = async (req, res, next) => {
  const { status, search, type, sort, limit, page } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
    ...(status && { status }), // optional query params
    ...(type && { type }),
    ...(search && { position: { $regex: search, $options: "i" } }), // case insensitive regex
  };

  try {
    const results = Job.find(queryObject); // no AWAIT here

    // https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()
    // sorting

    const sortStruct: Record<SortType, string> = {
      latest: "-createdAt",
      oldest: "createdAt",
      az: "position",
      za: "-position",
    };

    // pagination is achieved with 'limit' & 'skip'
    const dbLimit = Number(limit) || 10;

    const dbPage = Number(page) || 1;
    const dbSkip = (dbPage - 1) * dbLimit; // used by mongoose

    results.skip(dbSkip).limit(dbLimit); // still no AWAIT here

    // final response
    const jobs = await (sort ? results.sort(sortStruct[sort]) : results); // work more on query if sorting applied and await

    // add total jobs & amount of pages
    const totalJobs = await Job.countDocuments(queryObject); // similar to SQL's SELECT CALC ROWS ...
    const pages = Math.ceil(totalJobs / dbLimit);

    // const jobs = await Job.find({ createdBy: req.user.userId }).populate(
    //   "createdBy"
    // ); // JOIN user data

    res.status(StatusCodes.OK).json({ jobs, count: totalJobs, pages });
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

export const showStats: RequestHandler = async (req, res, next) => {
  try {
    const rawStats: {
      _id: string;
      count: number;
    }[] = await Job.aggregate([
      // Mongoose "autocasts" string values for ObjectId into their correct type in regular queries, but this does not happen in the aggregation pipeline
      { $match: { createdBy: new Types.ObjectId(req.user.userId) } }, // basic filter
      { $group: { _id: "$status", count: { $sum: 1 } } }, // enable sum
    ]);

    const stats = rawStats.reduce(
      (acc, current) => {
        const { _id: key, count } = current;
        acc[key as keyof typeof acc] = count;
        return acc;
      },
      {
        pending: 0,
        interview: 0,
        declined: 0,
      }
    );

    const rawMonthlyApplications: {
      _id: { year: number; month: number };
      count: number;
    }[] = await Job.aggregate([
      { $match: { createdBy: new Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }, // mongo's get year of date
            year: { $year: "$createdAt" }, // mongo's get month of date
          }, // group by month & year
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1, // year
          "_id.month": -1, // month
        }, // start from newest
      },
    ]);

    const monthlyApplications = rawMonthlyApplications.map((a) => {
      const {
        _id: { year, month },
        count,
      } = a; // a = {_id: {}, count: number}

      return { count: count, date: [month, year] };
    });

    res.status(StatusCodes.OK).json({ stats, monthlyApplications });
  } catch (e) {
    next(e);
  }
};
