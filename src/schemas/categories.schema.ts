import { z } from "zod";

export const categoriesSchema = {
  createCategory: z.object({
    body: z.object({
      name: z
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" })
    })
  }),
  updateCategory: z.object({
    body: z.object({
      name: z
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" })
    })
  })
};
