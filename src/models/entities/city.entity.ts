import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Address } from "./address.entity";

@Entity("cities")
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => Address, (address) => address.city, { cascade: true })
  address!: Address;
}
