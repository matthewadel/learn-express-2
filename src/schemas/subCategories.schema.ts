import { z } from "zod";

const createSubCategory = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(32, { message: "Name must be at most 32 characters long" }),
    parentCategoryId: z
      .number({
        required_error: "Parent Category ID is required",
        invalid_type_error: "Parent Category ID must be a number"
      })
      .positive({ message: "Parent Category ID must be a positive number" }),
    image: z.string().url({ message: "Image must be a valid URL" }).optional()
  })
});
const updateSubCategory = z.object({
  body: createSubCategory.shape.body.deepPartial()
});

export const subCategoriesSchema = { createSubCategory, updateSubCategory };
