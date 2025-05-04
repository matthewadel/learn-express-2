import { z } from "zod";
import { usersSchema } from "./users.schema";

const register = z
  .object({
    body: usersSchema.createUser.shape.body.innerType().omit({ role: true })
  })
  .strict();

const login = z
  .object({
    body: z.object({
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" })
    })
  })
  .strict();

const forgetPassword = z
  .object({
    body: z.object({
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" })
    })
  })
  .strict();

const verifyEmail = z
  .object({
    query: z.object({
      token: z.string({ required_error: "Token is required" }),
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" })
    })
  })
  .strict();

const resetPassword = z
  .object({
    body: z
      .object({
        email: z
          .string({ required_error: "Email is required" })
          .email({ message: "Invalid email address" }),
        newPassword: z
          .string({ required_error: "New password is required" })
          .min(6, { message: "Password must be at least 6 characters long" }),
        confirmPassword: z.string({
          required_error: "Confirm password is required"
        })
      })
      .superRefine((val, ctx) => {
        if (val.newPassword !== val.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "newPassword and confirmPassword must match"
          });
        }
      })
  })
  .strict();

const updateUserPassword = z
  .object({
    body: z
      .object({
        currentPassword: z
          .string({ required_error: "currentPassword is required" })
          .min(6, { message: "Password must be at least 6 characters long" }),
        newPassword: z
          .string({ required_error: "newPassword is required" })
          .min(6, { message: "Password must be at least 6 characters long" }),
        confirmPassword: z.string({
          required_error: "confirmPassword is required"
        })
      })
      .superRefine((val, ctx) => {
        if (val.newPassword !== val.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "newPassword and confirmPassword must match"
          });
        }
      })
  })
  .strict();

export const authSchema = {
  register,
  login,
  forgetPassword,
  verifyEmail,
  resetPassword,
  updateUserPassword
};
