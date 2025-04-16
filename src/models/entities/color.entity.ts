import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Product } from "./product.entity";

@Entity("colors")
export class Color {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name!: string;

  @ManyToMany(() => Product, (product) => product.colors)
  products!: Product[];
}
