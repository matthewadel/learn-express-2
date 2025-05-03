import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "./user.entity";
import { Address } from "./address.entity";
import { CartProducts } from "./cartProducts.entity";

export enum PaymentMethodTypes {
  CASH = "cash",
  VISA = "visa"
}

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("float", { default: 0 })
  tax_price!: number;

  @Column("float", { default: 0 })
  shipping_price!: number;

  @Column("float")
  total_price!: number;

  @Column({
    type: "enum",
    enum: PaymentMethodTypes,
    default: PaymentMethodTypes.CASH
  })
  paymentMethod!: PaymentMethodTypes;

  @Column({ default: false })
  is_paid!: boolean;

  @Column({ nullable: true })
  paid_at!: Date;

  @Column({ default: false })
  is_delivered!: boolean;

  @Column({ nullable: true })
  delivered_at!: Date;

  @ManyToOne(() => User, (user) => user.order)
  user!: User;

  @ManyToOne(() => Address, (address) => address.order)
  address!: Address;

  @OneToMany(() => CartProducts, (cartProduct) => cartProduct.order, {
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
