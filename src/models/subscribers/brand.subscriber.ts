import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent
} from "typeorm";
import { returnImageUrlInResoinse } from "../../middlewares/uploadSingleImage";
import { Brand } from "../entities/brand.entity";

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
