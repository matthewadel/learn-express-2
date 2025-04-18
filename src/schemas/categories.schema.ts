import { z } from "zod";

const createCategory = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(32, { message: "Name must be at most 32 characters long" }),
    image: z.string().url({ message: "Image must be a valid URL" }).optional()
  })
});
const updateCategory = z.object({
  body: createCategory.shape.body.deepPartial()
});

export const categoriesSchema = {
  createCategory,
  updateCategory
};
