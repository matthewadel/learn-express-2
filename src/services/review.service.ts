import { AppDataSource } from "../models";
import { BadRequestError, NotAuthorizedError } from "../utils";
import { Review } from "../models";
import { findOneBy } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { reviewSchema } from "../schemas";
import { z } from "zod";
import { Product } from "../models";
import { User } from "../models";

type CreateReviewBody = z.infer<typeof reviewSchema.createReview>;
type UpdateReviewBody = z.infer<typeof reviewSchema.updateReview>;

export class ReviewService {
  private ReviewRepository = AppDataSource.getRepository(Review);

  async createReview(
    userId: number,
    body: CreateReviewBody["body"]
  ): Promise<Review> {
    const review = await this.ReviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: +body.productId }
      }
    });

    const product = await findOneBy<Product>(Product, {
      id: +body.productId
    });

    const user = await findOneBy<User>(User, {
      id: userId
    });

    if (review)
      throw new BadRequestError("You've Already Reviewed This Product");

    return await this.ReviewRepository.save({ ...body, user, product });
  }

  async getAllReviews(
    requestParams: paginationInput<Review>,
    productId?: number
  ) {
    return await getPaginatedResultsWithFilter<Review>({
      entity: Review,
      getImtesParams: requestParams,
      search_columns: ["title"],
      inputOptions: {
        relations: ["user", "product"],
        where: productId ? { product: { id: productId } } : {}
      }
    });
  }

  async getReviewById(id: number): Promise<Review> {
    return await findOneBy<Review>(Review, {
      id,
      options: { relations: ["user", "product"] }
    });
  }

  async updateReview(
    user: User,
    id: number,
    body: UpdateReviewBody["body"]
  ): Promise<Review> {
    const review = await this.getReviewById(id);

    this._handleAuthorization(user, review);

    if (body.productId) {
      const product = await findOneBy<Product>(Product, { id: body.productId });
      review.product = product;
    }
    await this.ReviewRepository.save({ ...review, ...body });
    return review;
  }

  async deleteReview(user: User, id: number): Promise<void> {
    const review = await this.getReviewById(id);
    this._handleAuthorization(user, review);
    await this.ReviewRepository.remove(review);
  }

  private _handleAuthorization(user: User, review: Review) {
    if (user.role !== "admin" && review.user.id !== user.id)
      throw new NotAuthorizedError(
        "You are not authorized to perform this action"
      );
  }
}
