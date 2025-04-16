import { Like } from "typeorm";
import { AppDataSource } from "../models/data-source";
import { Category } from "../models/entities/category.entity";
import { BadRequestError } from "../utils/errors";
import { getPaginatedResult } from "../utils/getPaginatedResult";
import { SubCategory } from "../models/entities/subCategory.entity";
import { findOneBy } from "../utils/findOneBy";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(name: string): Promise<Category> {
    const cat = await this.categoryRepository.findOneBy({ name });
    if (cat) throw new BadRequestError("This Category Already Exists");

    const category = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(category);
  }

  async getAllCategories(
    page: number = 1,
    limit: number = 10,
    name?: string
  ): Promise<{
    data: Category[];
    totalPages: number;
    totalItems: number;
  }> {
    return await getPaginatedResult<Category>(Category, page, limit, {
      where: { name: Like(`%${name || ""}%`) }
    });
  }

  async getSubCategoriesInsideCategory(
    page: number = 1,
    limit: number = 10,
    categoryId?: number
  ): Promise<{
    data: SubCategory[];
    totalPages: number;
    totalItems: number;
  }> {
    return await getPaginatedResult<SubCategory>(SubCategory, page, limit, {
      where: { parent_category: { id: categoryId } }
    });
  }

  async getCategoryById(id: number): Promise<Category> {
    return await findOneBy<Category>(Category, { id });
  }

  async updateCategory(
    id: number,
    name?: string,
    image?: string
  ): Promise<Category> {
    const category = await findOneBy<Category>(Category, { id });

    if (name) category.name = name;
    if (image) category.image = image;
    await this.categoryRepository.update({ id }, category);
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await findOneBy<Category>(Category, { id });

    await this.categoryRepository.remove(category);
  }
}
