import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils/getAllItemsValidationWithPagination";

const createBrand = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(32, { message: "Name must be at most 32 characters long" }),
    image: z.string().url({ message: "Image must be a valid URL" }).optional()
  })
});
const updateBrand = z.object({
  body: createBrand.shape.body.deepPartial()
});

const getAllBrands = getALlItemsValidationWithPagination(
  createBrand.shape.body.shape
);

export const brandsSchema = {
  createBrand,
  updateBrand,
  getAllBrands
};
