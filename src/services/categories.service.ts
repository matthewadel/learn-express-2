import { Like } from "typeorm";
import { AppDataSource } from "../models/data-source";
import { Category } from "../models/entities/category.entity";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { getPaginatedResult } from "../utils/getPaginatedResult";
import { SubCategory } from "../models/entities/subCategory.entity";

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
      where: { parentCategory: { id: categoryId } }
    });
  }

  async getCategoryById(id: number): Promise<Category> {
    return await this._findOneBy({ id });
  }

  async updateCategory(id: number, name: string): Promise<Category> {
    const category = await this._findOneBy({ id });

    category.name = name;
    await this.categoryRepository.update({ id }, category);
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this._findOneBy({ id });

    await this.categoryRepository.remove(category);
  }

  private async _findOneBy({ id, name }: { id?: number; name?: string }) {
    const category = await this.categoryRepository.findOneBy({ id, name });
    if (!category) throw new NotFoundError("Category not found.");
    return category;
  }
}
