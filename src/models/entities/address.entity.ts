import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn
} from "typeorm";
import { User } from "./user.entity";
import { City } from "./city.entity";

export enum AddressAlias {
  HOME = "home",
  WORK = "work"
}
@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  details!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  postalCode!: number;

  @Column({ type: "enum", enum: AddressAlias })
  alias!: AddressAlias;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  user!: User;

  @OneToOne(() => City, (city) => city.address, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cityId" })
  city!: City;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;
}
