import { z } from "zod";

export const brandsSchema = {
  createBrand: z.object({
    body: z.object({
      name: z
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" }),
      image: z.string().url({ message: "Image must be a valid URL" }).optional()
    })
  }),
  updateBrand: z.object({
    body: z.object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" })
        .optional(),
      image: z.string().url({ message: "Image must be a valid URL" }).optional()
    })
  })
};
