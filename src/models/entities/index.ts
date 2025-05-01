import { Brand } from "./brand.entity";
import { Category } from "./category.entity";
import { Color } from "./color.entity";
import { Image } from "./image.entity";
import { Product } from "./product.entity";
import { SubCategory } from "./subCategory.entity";
import { User } from "./user.entity";
import { Review } from "./review.entity";

const entities = [
  User,
  Category,
  SubCategory,
  Brand,
  Image,
  Product,
  Color,
  Review
];

export { entities };
