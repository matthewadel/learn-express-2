import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { authSchema } from "../schemas/auth.schema";
import { AuthController } from "../controllers/auth.controller";
import {
  compressSingleImage,
  uploadSingleImage
} from "../middlewares/uploadSingleImage";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  uploadSingleImage("profileImage"),
  compressSingleImage("profileImage", "profileImages"),
  validateRequestSchema(authSchema.register),
  authController.register
);

router.post(
  "/login",
  validateRequestSchema(authSchema.login),
  authController.login
);

router.post(
  "/forgetPassword",
  validateRequestSchema(authSchema.forgetPassword),
  authController.forgetPassword
);

router.post(
  "/verifyResetCode",
  validateRequestSchema(authSchema.verifyResetCode),
  authController.verifyResetCode
);

router.post(
  "/resetPassword",
  validateRequestSchema(authSchema.resetPassword),
  authController.resetPassword
);

export default router;
