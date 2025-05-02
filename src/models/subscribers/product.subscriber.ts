import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent
} from "typeorm";
import { getEnv } from "../../utils";
import { Product } from "../entities/product.entity";

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }

  afterLoad(entity: Product) {
    if (entity.image_cover) {
      entity.image_cover = `${getEnv().BASE_URL}/productCovers/${entity.image_cover}`;
    }
    console.log({ image_cover: entity.image_cover });
    if (entity.images && Array.isArray(entity.images)) {
      entity.images = entity.images.map((image) => {
        return {
          ...image,
          url: `${getEnv().BASE_URL}/products/${image.url}`
        };
      });
    }
  }

  afterInsert(event: InsertEvent<Product>) {
    const entity = event.entity;
    if (entity.image_cover) {
      entity.image_cover = `${getEnv().BASE_URL}/productCovers/${entity.image_cover}`;
    }

    if (entity.images && Array.isArray(entity.images)) {
      entity.images = entity.images.map((image) => {
        return {
          ...image,
          url: `${getEnv().BASE_URL}/products/${image.url}`
        };
      });
    }
  }
}
