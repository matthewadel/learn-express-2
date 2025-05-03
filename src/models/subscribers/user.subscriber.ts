import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent
} from "typeorm";
import { returnImageUrlInResoinse } from "../../middlewares/uploadSingleImage";
import { User } from "../entities/user.entity";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
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
