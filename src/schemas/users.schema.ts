import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils";
import { UserRoles } from "../models";

const createUser = z
  .object({
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
        role: z
          .enum(Object.values(UserRoles) as [string, ...string[]])
          .optional()
      })
      .superRefine((val, ctx) => {
        if (val.password !== val.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password and confirmPassword must match"
          });
        }
      })
  })
  .strict();

const updateUser = z
  .object({
    body: createUser.shape.body
      .innerType()
      .omit({ password: true, confirmPassword: true })
      .deepPartial()
  })
  .strict();

const getAllUsers = getALlItemsValidationWithPagination(
  createUser.shape.body.innerType().shape
);

const changeUserRole = z
  .object({
    body: z.object({
      role: z.enum(Object.values(UserRoles) as [string, ...string[]]).optional()
    })
  })
  .strict();

export const usersSchema = {
  createUser,
  updateUser,
  getAllUsers,
  changeUserRole
};
