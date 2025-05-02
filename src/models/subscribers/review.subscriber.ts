import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent
} from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";
import { Review } from "../entities/review.entity";

@EventSubscriber()
export class ReviewSubscriber implements EntitySubscriberInterface<Review> {
  reviewRepository = AppDataSource.getRepository(Review);
  productRepository = AppDataSource.getRepository(Product);

  listenTo() {
    return Review;
  }

  async afterInsert(event: InsertEvent<Review>) {
    this.reviewRepository = event.manager.getRepository(Review);
    await this.updateProductRatings(event.entity.product.id);
  }

  async afterRemove(event: RemoveEvent<Review>) {
    if (event.entity) {
      this.reviewRepository = event.manager.getRepository(Review);
      await this.updateProductRatings(event.entity.product.id);
    }
  }

  private async updateProductRatings(productId: number) {
    // Fetch all reviews for the product
    const reviews = await this.reviewRepository.find({
      where: { product: { id: productId } }
    });

    // Calculate ratings_average and number_of_reviewers
    const number_of_reviewers = reviews.length;
    const ratings_average =
      number_of_reviewers > 0
        ? reviews.reduce((sum, review) => sum + review.ratings, 0) /
          number_of_reviewers
        : 0;

    // Update the product
    await this.productRepository.update(productId, {
      ratings_average,
      number_of_reviewers
    });
  }
}
