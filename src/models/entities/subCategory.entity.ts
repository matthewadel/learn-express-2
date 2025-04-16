import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  ManyToMany
} from "typeorm";
import { Category } from "./category.entity";
import { MaxLength, MinLength } from "class-validator";
import { Product } from "./product.entity";

@Entity("sub-categories")
@Unique(["name"])
export class SubCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(3)
  @MaxLength(32)
  name!: string;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    onDelete: "CASCADE"
  })
  parent_category!: Category;

  @ManyToMany(() => Product, (product) => product.subCategories)
  products!: Product[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;
}
