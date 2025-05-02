import { Brand } from "./brand.entity";
import { Category } from "./category.entity";
import { Color } from "./color.entity";
import { Image } from "./image.entity";
import { Product } from "./product.entity";
import { Review } from "./review.entity";
import { SubCategory } from "./subCategory.entity";
import { User } from "./user.entity";
import { Address } from "./address.entity";
import { City } from "./city.entity";
import { Coupon } from "./coupon.entity";

const entities = [
  User,
  Brand,
  Category,
  SubCategory,
  Image,
  Color,
  Review,
  Product,
  Address,
  City,
  Coupon
];

export { entities };
