// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { MinLength } from "class-validator";

@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({ nullable: true })
  @MinLength(3, { message: "Name must be at least 3 characters long." })
  name!: string;
}
