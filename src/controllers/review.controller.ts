import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { sendSuccessResponse } from "../utils/sendSuccessResponse";
import { paginationInput } from "../utils/getPaginatedResultsWithFilter";
import { Review } from "../models/entities/review.entity";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { User } from "../models/entities/user.entity";

export class ReviewController {
  reviewService = new ReviewService();

  createReview = asyncWrapper(async (req: Request, res: Response) => {
    const review = await this.reviewService.createReview(
      +(req.user?.id ?? 0),
      req.body
    );
    sendSuccessResponse({
      res,
      statusCode: 201,
      data: review,
      message: "Review Created Successfully"
    });
  });

  getAllReviews = asyncWrapper(async (req: Request, res: Response) => {
    const reviews = await this.reviewService.getAllReviews(
      req.query as unknown as paginationInput<Review>,
      +req.params.productId
    );
    sendSuccessResponse({ res, data: reviews });
  });

  getReviewById = asyncWrapper(async (req: Request, res: Response) => {
    const review = await this.reviewService.getReviewById(
      Number(req.params.id)
    );
    sendSuccessResponse({ res, data: review });
  });

  updateReview = asyncWrapper(async (req: Request, res: Response) => {
    const review = await this.reviewService.updateReview(
      req.user as User,
      +req.params.id,
      req.body
    );
    sendSuccessResponse({
      res,
      data: review,
      message: "Review Updated Successfully"
    });
  });

  deleteReview = asyncWrapper(async (req: Request, res: Response) => {
    await this.reviewService.deleteReview(req.user as User, +req.params.id);
    sendSuccessResponse({ res, message: "Review Deleted Successfully" });
  });

  setProductIdToBody = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.productId && req.params.productId)
        req.body.productId = +req.params.productId;
      next();
    }
  );
}
