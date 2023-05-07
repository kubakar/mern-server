import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../utils/error.js";

export const validateJobsForm: RequestHandler = (req, res, next) => {
  // const body: UserInterface = req.body;
  const { position, company } = req.body;

  // controller validation (prior to DB validation) for both login & register
  if (!position || !company)
    throw new CustomAPIError(
      "Please provide all values (jobs)", // throw custom error
      StatusCodes.BAD_REQUEST
    );

  next();
};
