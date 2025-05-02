import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { authSchema } from "../schemas";
import { AuthController } from "../controllers";
import { compressSingleImage, uploadSingleImage } from "../middlewares";
import { verifyToken } from "../middlewares";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  uploadSingleImage("profileImage"),
  compressSingleImage("profileImage", "profileImage", "profileImages"),
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

router.get(
  "/verify-email",
  validateRequestSchema(authSchema.verifyEmail),
  authController.verifyEmail
);

router.post(
  "/resetPassword",
  validateRequestSchema(authSchema.resetPassword),
  authController.resetPassword
);

router.get("/profile", verifyToken, authController.getUserProfile);

router.put(
  "/updatePassword",
  validateRequestSchema(authSchema.updateUserPassword),
  authController.updateUserPassword
);

export default router;
