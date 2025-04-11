// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Unique(["email"])
  email!: string;

  @Column({ nullable: true })
  name!: string;
}
