import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent
} from "typeorm";
import { returnImageUrlInResoinse } from "../../middlewares/uploadSingleImage";
import { Category } from "../entities/category.entity";

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
