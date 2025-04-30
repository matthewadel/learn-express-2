import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { User } from "../models/entities/user.entity";

export class AuthController {
  // Signup route handler
  authService = new AuthService();

  register = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    SendSuccessResponse<User>({
      res,
      data: user,
      message: "User Registered Successfully"
    });
  });

  // login route handler
  login = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.authService.login(req.body);
    SendSuccessResponse<User>({
      res,
      data: user,
      message: "User Logged Successfully"
    });
  });
}
