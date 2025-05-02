import { MinLength, MaxLength, Min, Max } from "class-validator";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent
} from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";
import { AppDataSource } from "../data-source";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  @MinLength(3)
  @MaxLength(32)
  title!: string;

  @Column({ type: "float" })
  @Min(1)
  @Max(5)
  ratings!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: "CASCADE"
  })
  product!: Product;
}

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
