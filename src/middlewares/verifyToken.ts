import { NextFunction, Request, Response } from "express";
import { NotAuthenticatedError } from "../utils/errors";
import jwt from "jsonwebtoken";
import { UsersService } from "../services/users.service";
import "express";
import { User } from "../models/entities/user.entity";

const usersService = new UsersService();

interface IDecodedToken extends jwt.JwtPayload {
  userId: number;
  role: string;
  iat: number;
}

declare module "express" {
  interface Request {
    user?: User;
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  let decoded: IDecodedToken;

  if (req.headers["authorization"]) {
    token = req.headers["authorization"].split(" ")[1];
  }

  // 1- check if token is provided or not
  if (!req.headers["authorization"] || !token)
    throw new NotAuthenticatedError(
      "Authorization Header Is Required To Access This Route"
    );

  // 2- check for token validation and expiration
  try {
    const result = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof result === "string") {
      throw new NotAuthenticatedError("Invalid token format");
    }
    decoded = result as IDecodedToken;
    console.log(decoded);
  } catch (e) {
    console.log(e);
    throw new NotAuthenticatedError((e as Error).message);
  }

  // 3- check if user exists as may hackers change the payload of the token
  const currentUser = await usersService.getUserById(decoded.userId);
  console.log({ currentUser });

  // 4- check if user has changed his password after login or not
  if (currentUser?.passwordChangedAt) {
    const passwordChangedAt = new Date(currentUser.passwordChangedAt).getTime();
    const tokenIssuedAt = new Date(decoded.iat * 1000).getTime();

    if (passwordChangedAt > tokenIssuedAt) {
      throw new NotAuthenticatedError("Token is invalid, please login again");
    }
  }

  // 5- save current user to request so other middlewares anc controllers can use it
  req.user = currentUser;

  next();
};
