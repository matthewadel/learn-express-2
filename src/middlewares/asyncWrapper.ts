import { NextFunction, Request, Response } from "express";
import { BadRequestError, HttpError } from "../utils/errors";

export const asyncWrapper = (asyncFunc: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFunc(req, res, next).catch((error: unknown) => {
      console.log(error);
      if (error instanceof HttpError) next(error);
      else
        next(
          new BadRequestError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
            error
          )
        );
    });
  };
};
