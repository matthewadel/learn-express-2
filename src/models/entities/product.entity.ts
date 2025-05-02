import {
  IsNotEmpty,
  IsPositive,
  Max,
  MaxLength,
  Min,
  MinLength
} from "class-validator";
import { Brand } from "./brand.entity";
import { SubCategory } from "./subCategory.entity";
import { Category } from "./category.entity";
import { Color } from "./color.entity";
import { Image } from "./image.entity";
import { Review } from "./review.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable
} from "typeorm";
import { User } from "./user.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  title!: string;

  @Column({ nullable: true })
  @MinLength(20)
  description!: string;

  @Column()
  @IsPositive()
  @IsNotEmpty()
  quantity!: number;

  @Column({ default: 0 })
  @IsPositive()
  number_of_times_sold!: number;

  @Column("float")
  @IsPositive()
  @IsNotEmpty()
  price!: number;

  @Column("float", { nullable: true })
  @IsPositive()
  price_after_discount!: number;

  @Column("float", { nullable: true })
  @Min(1)
  @Max(5)
  ratings_average!: number;

  @Column({ default: 0 })
  @IsPositive()
  number_of_reviewers!: number;

  @Column({ nullable: true })
  image_cover!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;

  // many to many
  @ManyToMany(() => Color, (color) => color.products, { nullable: false })
  @JoinTable({ name: "products_colors" })
  colors!: Color[];

  // many to many
  @ManyToMany(() => User, (user) => user.wishlist_products)
  favoritedBy!: User[];

  // one to many
  @ManyToOne(() => User, (user) => user.products, { cascade: true })
  user!: User;

  // one to many
  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images!: Image[];

  // mandatory
  @ManyToOne(() => Brand, (brand) => brand.products, {
    onDelete: "CASCADE",
    nullable: false
  })
  brand!: Brand;

  // mandatory
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: "CASCADE",
    nullable: false
  })
  category!: Category;

  @ManyToMany(() => SubCategory, (subCategory) => subCategory.products)
  @JoinTable({ name: "products_sub_categories" })
  subCategories!: SubCategory[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews!: Review[];
}
