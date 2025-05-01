import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { User } from "../models/entities/user.entity";
import { authSchema } from "../schemas/auth.schema";
import { z } from "zod";

type verifyEmailParams = z.infer<typeof authSchema.verifyEmail>;

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

  forgetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.authService.forgetPassword(req.body);
    SendSuccessResponse<{ verificationUrl?: string }>({
      res,
      data,
      message: "Code Sent Successfully, Please Check Your Email"
    });
  });

  verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.query as verifyEmailParams["query"]);
    SendSuccessResponse<User>({
      res,
      message: "Code Is Verified Successfully"
    });
  });

  resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.authService.resetPassword(req.body);
    SendSuccessResponse<User>({
      res,
      data,
      message: "password reset successfully"
    });
  });
}
