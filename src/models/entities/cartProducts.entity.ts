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
import { Order } from "./order.entity";

@Entity("cart_products")
export class CartProducts {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts, { onDelete: "SET NULL" })
  cart!: Cart;

  @ManyToOne(() => Order, (order) => order.cartProducts, {
    onDelete: "CASCADE"
  })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.cartProducts, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column("int", { default: 1 })
  quantity!: number;

  @Column("float")
  price!: number;

  @ManyToOne(() => Color, { nullable: true })
  @JoinColumn({ name: "color_id" })
  color!: Color;
}
