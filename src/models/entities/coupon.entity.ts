import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

export enum DiscountType {
  PERCENTAGE = "percentage",
  DEDUCTION = "deduction"
}

@Entity("coupons")
@Unique(["name"])
export class Coupon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  expire!: Date;

  @Column()
  discount!: number;

  @Column({
    type: "enum",
    enum: DiscountType,
    default: DiscountType.PERCENTAGE
  })
  discount_type!: DiscountType;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;
}
