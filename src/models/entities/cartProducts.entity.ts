import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn
} from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";
import { Color } from "./color.entity";

@Entity("cart_products")
export class CartProducts {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart!: Cart;

  @ManyToOne(() => Product, (product) => product.cartProducts, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column("int")
  quantity!: number;

  @Column("float")
  price!: number;

  @ManyToOne(() => Color, { nullable: true })
  @JoinColumn({ name: "color_id" })
  color!: Color;
}
