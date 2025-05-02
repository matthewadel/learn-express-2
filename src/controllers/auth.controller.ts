import { Request, Response } from "express";
import { AuthService } from "../services";
import { sendSuccessResponse } from "../utils";
import { asyncWrapper } from "../middlewares";
import { User } from "../models";
import { authSchema } from "../schemas";
import { z } from "zod";
import { UsersService } from "../services";

type verifyEmailParams = z.infer<typeof authSchema.verifyEmail>;

export class AuthController {
  // Signup route handler
  authService = new AuthService();
  usersService = new UsersService();

  register = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    sendSuccessResponse<User>({
      res,
      data: user,
      message: "User Registered Successfully"
    });
  });

  // login route handler
  login = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.authService.login(req.body);
    sendSuccessResponse<User>({
      res,
      data: user,
      message: "User Logged Successfully"
    });
  });

  forgetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.authService.forgetPassword(req.body);
    sendSuccessResponse<{ verificationUrl?: string }>({
      res,
      data,
      message: "Code Sent Successfully, Please Check Your Email"
    });
  });

  verifyEmail = asyncWrapper(async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req.query as verifyEmailParams["query"]);
    sendSuccessResponse<User>({
      res,
      message: "Code Is Verified Successfully"
    });
  });

  resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.authService.resetPassword(req.body);
    sendSuccessResponse<User>({
      res,
      data,
      message: "password reset successfully"
    });
  });

  getUserProfile = asyncWrapper(async (req: Request, res: Response) => {
    if (req.user?.id) {
      const data = await this.usersService.getUserById(+req.user?.id);
      sendSuccessResponse<User>({
        res,
        data
      });
    }
  });

  updateUserPassword = asyncWrapper(async (req: Request, res: Response) => {
    if (req.user?.id) {
      const data = await this.usersService.updatePassword(
        +req.user?.id,
        req.body
      );
      sendSuccessResponse<User>({
        res,
        data,
        message: "Password Updated Successfully"
      });
    }
  });
}
