import { IsNotEmpty, Max, MaxLength, Min, MinLength } from "class-validator";
import { Brand } from "./brand.entity";
import { SubCategory } from "./subCategory.entity";
import { Category } from "./category.entity";
import { Color } from "./color.entity";
import { Image } from "./Image.entity";
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

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  title!: string;

  @Column()
  @MinLength(20)
  description!: string;

  @Column()
  @MinLength(20)
  @IsNotEmpty()
  quantity!: number;

  @Column({ default: 0 })
  number_of_times_sold!: number;

  @Column()
  @IsNotEmpty()
  price!: number;

  @Column({ nullable: true })
  price_after_discount!: number;

  @Column({ nullable: true })
  @Min(1)
  @Max(5)
  ratings_average!: number;

  @Column({ default: 0 })
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

  // one to many
  @OneToMany(() => Image, (image) => image.product)
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
}
