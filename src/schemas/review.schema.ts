import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils/getAllItemsValidationWithPagination";

const createReview = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(32, { message: "Title must be at most 32 characters long" }),
    ratings: z
      .number({ required_error: "Ratings are required" })
      .min(1, { message: "Ratings must be at least 1" })
      .max(5, { message: "Ratings must be at most 5" }),
    productId: z
      .number({ required_error: "Product ID is required" })
      .positive({ message: "Product ID must be a positive number" })
  })
});

const updateReview = z.object({
  body: createReview.shape.body.deepPartial()
});

const getAllReviews = getALlItemsValidationWithPagination(
  createReview.shape.body.shape
);

export const reviewSchema = {
  createReview,
  updateReview,
  getAllReviews
};
