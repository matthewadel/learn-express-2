import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../models/data-source";
import { Category } from "../models/entities/category.entity";
import { SubCategory } from "../models/entities/subCategory.entity";
import { BadRequestError } from "../utils/errors";
import { findOneBy } from "../utils/findOneBy";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";
import multer from "multer";
import { v4 } from "uuid";
import sharp from "sharp";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { categoriesSchema } from "../schemas";
import { z } from "zod";

type CreateCategotyBody = z.infer<typeof categoriesSchema.createCategory>;
type UpdateCategoryBody = z.infer<typeof categoriesSchema.updateCategory>;

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(body: CreateCategotyBody["body"]): Promise<Category> {
    const cat = await this.categoryRepository.findOneBy({ name: body.name });
    if (cat) throw new BadRequestError("This Category Already Exists");

    const category = this.categoryRepository.create(body);
    return await this.categoryRepository.save(category);
  }

  async getAllCategories(requestParams: paginationInput<Category>) {
    return await getPaginatedResultsWithFilter<Category>(
      Category,
      requestParams,
      ["name"]
    );
  }

  async getSubCategoriesInsideCategory(
    categoryId: number,
    requestParams: paginationInput<SubCategory>
  ) {
    return await getPaginatedResultsWithFilter<SubCategory>(
      SubCategory,
      requestParams,
      ["name"],
      { where: [{ parent_category: { id: categoryId } }] }
    );
  }

  async getCategoryById(id: number): Promise<Category> {
    return await findOneBy<Category>(Category, { id });
  }

  async updateCategory(
    id: number,
    body: UpdateCategoryBody["body"]
  ): Promise<Category> {
    const category = await findOneBy<Category>(Category, { id: id });

    return await this.categoryRepository.save({ ...category, ...body });
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await findOneBy<Category>(Category, { id });

    await this.categoryRepository.remove(category);
  }
}

// disk storage solution
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${v4()}-${Date.now()}.${ext}`;
//     console.log(filename);
//     cb(null, filename);
//   }
// });

// memory storage solution
const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: Function
): void => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new BadRequestError("only images are allowed"), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadCategoryImage = upload.single("image");
export const compressImage = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const filename = `category-${v4()}-${Date.now()}.png`;
    if (req.file?.buffer) {
      await sharp(req.file?.buffer)
        .resize(300, 300)
        .toFormat("png")
        .png({ quality: 80 })
        .toFile(`src/uploads/categories/${filename}`);

      req.body.image = filename;
    }
    next();
  }
);
