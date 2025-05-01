import { MinLength, MaxLength, Min, Max } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";

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
