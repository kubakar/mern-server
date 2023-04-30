import { StatusCodes } from "http-status-codes";

// extend standard Error with status code
export class CustomAPIError extends Error {
  statusCode: StatusCodes;
  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}
