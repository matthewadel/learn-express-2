import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errors";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errors: err.errors
    });
  } else {
    // Default error handling for unexpected errors
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      ...(process.env.NODE_ENV === "development"
        ? { details: err.message }
        : {})
    });
  }
};
