import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index
} from "typeorm";
import { MaxLength, MinLength } from "class-validator";
import { Review } from "./review.entity";
import { Product } from "./product.entity";
import { Address } from "./address.entity";
import { Cart } from "./cart.entity";

export enum UserRoles {
  ADMIN = "admin",
  USER = "user"
}

@Entity("users")
@Unique(["email"])
@Index(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(3)
  @MaxLength(32)
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  profileImage!: string;

  @Column({ nullable: true })
  passwordResetCode!: string;

  @Column({ nullable: true })
  resetPasswordVerified!: boolean;

  @Column({ type: "timestamp", nullable: true })
  passwordResetExpires!: Date | null;

  @Column()
  password!: string;

  @Column({ type: "timestamp", nullable: true })
  passwordChangedAt!: Date;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.USER })
  role!: UserRoles;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;

  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews!: Review[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  @JoinTable({ name: "wishlist" })
  wishlist_products!: Product[];

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses!: Address[];

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  products!: Product[];

  @OneToMany(() => Cart, (cart) => cart.user, { onDelete: "CASCADE" })
  userCarts!: Cart[];
}
