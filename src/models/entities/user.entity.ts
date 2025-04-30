import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  UpdateEvent
} from "typeorm";
import { MaxLength, MinLength } from "class-validator";
import { returnImageUrlInResoinse } from "../../middlewares/uploadSingleImage";

export enum UserRoles {
  ADMIN = "admin",
  USER = "user"
}

@Entity("users")
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(3)
  @MaxLength(32)
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  profileImage!: string;

  @Column()
  password!: string;

  @Column({ type: "timestamp", nullable: true })
  passwordChangedAt!: Date;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.USER })
  role!: UserRoles;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at?: Date;
}

@EventSubscriber()
export class UserGenericSubscriber implements EntitySubscriberInterface<User> {
  // works in get and update
  async afterLoad(entity: User) {
    returnImageUrlInResoinse<User>({
      entity,
      fieldName: "profileImage",
      folderName: "profileImages"
    });

    // Exclude the password field
    // delete (entity as Partial<User>).password;
  }

  // works after insert
  async afterInsert(event: InsertEvent<User>) {
    returnImageUrlInResoinse<User>({
      entity: event.entity,
      fieldName: "profileImage",
      folderName: "profileImages"
    });

    // Exclude the password field
    // delete (event.entity as User as Partial<User>).password;
  }

  async afterUpdate(event: UpdateEvent<User>) {
    returnImageUrlInResoinse<User>({
      entity: event.entity as User,
      fieldName: "profileImage",
      folderName: "profileImages"
    });

    // Exclude the password field
    // delete (event.entity as User as Partial<User>).password;
  }
}
