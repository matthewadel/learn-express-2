import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../models/entities/user.entity";
import { NotAuthorizedError } from "../utils/errors";
import { asyncWrapper } from "./asyncWrapper";

export const allowedTo = (roles: UserRoles[]) => {
  return asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!roles.find((role) => role === req.user?.role))
        throw new NotAuthorizedError(
          "You are not authorized to perform this action"
        );
      next();
    }
  );
};
