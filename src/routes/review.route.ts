import express from "express";
import { ReviewController } from "../controllers";
import { validateRequestSchema } from "../middlewares";
import { reviewSchema } from "../schemas";
import { verifyToken } from "../middlewares";
import { allowedTo } from "../middlewares";
import { UserRoles } from "../models";

const router = express.Router({ mergeParams: true });
const reviewController = new ReviewController();

router
  .route("/")
  .post(
    verifyToken,
    allowedTo([UserRoles.USER]),
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
    allowedTo([UserRoles.USER]),
    validateRequestSchema(reviewSchema.updateReview),
    reviewController.updateReview
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.USER, UserRoles.ADMIN]),
    reviewController.deleteReview
  );

export default router;
