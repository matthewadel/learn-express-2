import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  InsertEvent
} from "typeorm";
import { SubCategory } from "./subCategory.entity";
import { MaxLength, MinLength } from "class-validator";
import { Product } from "./product.entity";
import { EventSubscriber, EntitySubscriberInterface } from "typeorm";
import { returnImageUrlInResoinse } from "../../middlewares";

@Entity("categories")
@Unique(["name"])
export class Category {
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

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  @OneToMany(() => SubCategory, (subCategory) => subCategory.parent_category)
  subCategories!: SubCategory[];
}

//it is somethinng like mongoose middle schema.post('init',()=>{}) in get and schema.post('init',()=>{}) in create
@EventSubscriber()
export class CategoryGenericSubscriber
  implements EntitySubscriberInterface<Category>
{
  // works in get and update
  async afterLoad(entity: Category) {
    returnImageUrlInResoinse<Category>({
      entity,
      fieldName: "image",
      folderName: "categories"
    });
  }

  // works after insert
  async afterInsert(event: InsertEvent<Category>) {
    returnImageUrlInResoinse<Category>({
      entity: event.entity,
      fieldName: "image",
      folderName: "categories"
    });
  }
}
