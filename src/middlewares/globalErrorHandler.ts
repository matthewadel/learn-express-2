import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errors";

export const globalErrorHandler: ErrorRequestHandler = (
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
      success: false,
      message: err.message ?? "Something went wrong"
    });
  }
};
