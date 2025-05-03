// handle delete cascade

// - the user can have multiple carts (user - cart one to many)
// - (product - cart) many to many, the table has total price and price after discount
// - cartProduct is the joint table and has quantity, price, color (one to one with color table)

// - if the user added a new product to his cart for the first time, a new row in cart table will be created
// - if the product with the same color already exist in the cart, we will just increase the quantity
// - if the product has different color or different price, we will add a new product to the cart

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;
}
