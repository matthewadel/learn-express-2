import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils/getAllItemsValidationWithPagination";
import { UserRoles } from "../models/entities/user.entity";

const createUser = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" }),
      email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
      phone: z.string().optional(),
      profileImage: z.string().optional(),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
      confirmPassword: z.string({
        required_error: "confirmPassword is required"
      }),
      role: z.enum(Object.values(UserRoles) as [string, ...string[]]).optional()
    })
    .superRefine((val, ctx) => {
      if (val.password !== val.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password and confirmPassword must match"
        });
      }
    })
});

const updateUser = z.object({
  body: createUser.shape.body.innerType().deepPartial()
});

const updateUserPassword = z.object({
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
});

const getAllUsers = getALlItemsValidationWithPagination(
  createUser.shape.body.innerType().shape
);

export const usersSchema = {
  createUser,
  updateUser,
  getAllUsers,
  updateUserPassword
};
