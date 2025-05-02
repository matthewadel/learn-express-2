import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils";

const createCategory = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(32, { message: "Name must be at most 32 characters long" }),
    image: z.string().optional()
  })
});
const updateCategory = z.object({
  body: createCategory.shape.body.deepPartial()
});

const getAllCategories = getALlItemsValidationWithPagination(
  createCategory.shape.body.shape
);

export const categoriesSchema = {
  createCategory,
  updateCategory,
  getAllCategories
};
