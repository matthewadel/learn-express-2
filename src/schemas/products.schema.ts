import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils/getAllItemsValidationWithPagination";

const createProductSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "title is required" })
      .min(3, { message: "title must be at least 3 characters long" })
      .max(100, { message: "title must be at most 100 characters long" }),
    description: z
      .string()
      .min(20, { message: "description must be at least 20 characters long" })
      .optional(),
    quantity: z
      .string({ required_error: "quantity is required" })
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("quantity must be a number");
        }
        if (parsed < 1) {
          throw new Error("quantity must be a positive number");
        }
        return parsed;
      }),
    number_of_times_sold: z
      .string()
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("number_of_times_sold must be a number");
        }
        if (parsed < 1) {
          throw new Error("number_of_times_sold must be a positive number");
        }
        return parsed;
      })
      .optional(),
    price: z
      .string({ required_error: "price is required" })
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("price must be a number");
        }
        if (parsed < 1) {
          throw new Error("price must be a positive number");
        }
        return parsed;
      }),
    price_after_discount: z
      .string()
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("price_after_discount must be a number");
        }
        if (parsed < 1) {
          throw new Error("price_after_discount must be a positive number");
        }
        return parsed;
      })
      .optional(),
    ratings_average: z
      .string()
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("ratings_average must be a number");
        }
        if (parsed < 1) {
          throw new Error("ratings_average must be a positive number");
        }
        if (parsed < 1 || parsed > 5) {
          throw new Error("ratings_average must be at least 1 and at most 5");
        }
        return parsed;
      })
      .optional(),
    number_of_reviewers: z
      .string()
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("number_of_reviewers must be a number");
        }
        if (parsed < 1) {
          throw new Error("number_of_reviewers must be a positive number");
        }
        return parsed;
      })
      .optional(),
    image_cover: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    brand: z
      .string({ required_error: "brand is required" })
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("brand must be a number");
        }
        if (parsed < 1) {
          throw new Error("brand must be a positive number");
        }
        return parsed;
      }),
    category: z
      .string({ required_error: "category is required" })
      .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          throw new Error("category must be a number");
        }
        if (parsed < 1) {
          throw new Error("category must be a positive number");
        }
        return parsed;
      }),
    colors: z
      .string()
      .transform((val) => {
        const parsed = JSON.parse(val);

        if (
          parsed.some(function (element: string) {
            return isNaN(parseInt(element, 10));
          })
        )
          throw new Error("colors must be a number");
        else if (
          parsed.some(function (element: number) {
            return element < 0;
          })
        )
          throw new Error("colors must be a positive number");
        return parsed;
      })
      .optional(),
    subCategories: z
      .string()
      .transform((val) => {
        const parsed = JSON.parse(val);
        if (
          parsed.some(function (element: string) {
            return isNaN(parseInt(element, 10));
          })
        )
          throw new Error("subCategories must be a number");
        else if (
          parsed.some(function (element: number) {
            return element < 0;
          })
        )
          throw new Error("subCategories must be a positive number");
        return parsed;
      })
      .optional()
  })
});

const updateProductSchema = z.object({
  body: z
    .object({
      ...createProductSchema.shape.body.shape,
      deletedImagesIds: z.array(z.number()).optional()
    })
    .partial()
});

const getAllProducts = getALlItemsValidationWithPagination(
  createProductSchema.shape.body.shape
);

export const productsSchema = {
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
  getAllProducts
};
