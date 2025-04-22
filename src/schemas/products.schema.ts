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
      .number({
        required_error: "quantity is required",
        invalid_type_error: "quantity must be a number"
      })
      .positive({ message: "quantity must be a positive number" }),
    number_of_times_sold: z
      .number({ invalid_type_error: "number_of_times_sold must be a number" })
      .positive({ message: "number_of_times_sold must be a positive number" })
      .optional(),
    price: z
      .number({
        required_error: "price is required",
        invalid_type_error: "price must be a number"
      })
      .positive({ message: "price must be a positive number" }),
    price_after_discount: z
      .number({ invalid_type_error: "price_after_discount must be a number" })
      .positive({ message: "price_after_discount must be a positive number" })
      .optional(),
    ratings_average: z
      .number({ invalid_type_error: "ratings_average must be a number" })
      .min(1, { message: "ratings_average must be at least 1" })
      .max(5, { message: "ratings_average must be at most 5" })
      .optional(),
    number_of_reviewers: z
      .number({ invalid_type_error: "number_of_reviewers must be a number" })
      .positive({ message: "number_of_reviewers must be a positive number" })
      .optional(),
    image_cover: z.string().optional(),
    colors: z
      .array(
        z.number({
          invalid_type_error: "colors must be a number"
        })
      )
      .optional(),
    images: z.array(z.string()).optional(),
    brand: z.number({
      required_error: "brand is required",
      invalid_type_error: "brand must be a number"
    }),
    category: z.number({
      required_error: "category is required",
      invalid_type_error: "category must be a number"
    }),
    subCategories: z
      .array(
        z.number({
          invalid_type_error: "subCategories must be a number"
        })
      )
      .optional()
  })
  // .refine(
  //   (data) =>
  //     data.price_after_discount === undefined ||
  //     data.price < data.price_after_discount,
  //   {
  //     message: "price must be lower than price_after_discount",
  //     path: ["price"]
  //   }
  // )
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
