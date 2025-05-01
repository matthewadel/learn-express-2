import { z } from "zod";
import { usersSchema } from "./users.schema";

const register = z.object({
  body: usersSchema.createUser.shape.body.innerType()
});

const login = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
  })
});

const forgetPassword = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" })
  })
});
const verifyResetCode = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    resetCode: z
      .string({ required_error: "Reset code is required" })
      .min(6, { message: "Reset code must be at least 6 characters long" })
  })
});
const resetPassword = z.object({
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
});

export const authSchema = {
  register,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword
};
