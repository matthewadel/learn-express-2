import { MinLength, MaxLength } from "class-validator";
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  EventSubscriber,
  InsertEvent,
  EntitySubscriberInterface
} from "typeorm";
import { Product } from "./product.entity";
import { returnImageUrlInResoinse } from "../../middlewares/uploadSingleImage";

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
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;

  @OneToMany(() => Product, (product) => product.brand, {
    cascade: true
  })
  products!: Product[];
}

@EventSubscriber()
export class BrandGenericSubscriber
  implements EntitySubscriberInterface<Brand>
{
  async afterLoad(entity: Brand) {
    returnImageUrlInResoinse<Brand>({
      entity,
      fieldName: "image",
      folderName: "brands"
    });
  }
  async afterInsert(event: InsertEvent<Brand>) {
    returnImageUrlInResoinse<Brand>({
      entity: event.entity,
      fieldName: "image",
      folderName: "brands"
    });
  }
}
