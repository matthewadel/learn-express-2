import { MinLength, MaxLength } from "class-validator";
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("brands")
@Unique(["name"])
export class Brand {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(3)
  @MaxLength(32)
  name!: string;

  @Column({ nullable: true })
  image!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updatedAt?: Date;
}
