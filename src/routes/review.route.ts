import express from "express";
import { ReviewController } from "../controllers";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { reviewSchema } from "../schemas/review.schema";
import { verifyToken } from "../middlewares/verifyToken";
import { allowedTo } from "../middlewares/allowedTo";
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
