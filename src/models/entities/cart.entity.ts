// handle delete cascade

// - if the user added a new product to his cart for the first time, a new row in cart table will be created
// - if the product with the same color already exist in the cart, we will just increase the quantity
// - if the product has different color or different price, we will add a new product to the cart

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Column
} from "typeorm";
import { User } from "./user.entity";
import { CartProducts } from "./cartProducts.entity";

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userCarts, { cascade: true })
  user!: User;

  @OneToMany(() => CartProducts, (cartProduct) => cartProduct.cart, {
    cascade: true
  })
  cartProducts!: CartProducts[];

  @Column("float", { default: 0 })
  totalPrice!: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;
}
