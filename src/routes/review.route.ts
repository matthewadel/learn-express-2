import express from "express";
import { ReviewController } from "../controllers";
import { validateRequestSchema } from "../middlewares";
import { reviewSchema } from "../schemas";
import { verifyToken } from "../middlewares";

const router = express.Router({ mergeParams: true });
const reviewController = new ReviewController();

router
  .route("/")
  .post(
    verifyToken,
    reviewController.setProductIdToBody,
    validateRequestSchema(reviewSchema.createReview),
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .put(
    verifyToken,
    validateRequestSchema(reviewSchema.updateReview),
    reviewController.updateReview
  )
  .delete(verifyToken, reviewController.deleteReview);

export default router;
