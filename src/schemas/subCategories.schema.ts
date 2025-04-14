import { z } from "zod";

export const subCategoriesSchema = {
  createSubCategory: z.object({
    body: z.object({
      name: z
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" }),
      parentCategoryId: z
        .number({ required_error: "Parent Category ID is required" })
        .positive({ message: "Parent Category ID must be a positive number" }),
      image: z.string().url({ message: "Image must be a valid URL" }).optional()
    })
  }),
  updateSubCategory: z.object({
    body: z.object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" }),
      parentCategoryId: z
        .number()
        .positive({ message: "Parent Category ID must be a positive number" })
        .optional(),
      image: z.string().url({ message: "Image must be a valid URL" }).optional()
    })
  })
};
