import { AppDataSource } from "../models/data-source";
import { Category } from "../models/entities/category.entity";
import { BadRequestError, NotFoundError } from "../utils/errors";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(
    name: string
  ): Promise<{ success: boolean; message: string; data?: Category }> {
    if (await this._findOneBy(name))
      throw new BadRequestError("This Category Already Exists");

    const category = this.categoryRepository.create({ name });
    await this.categoryRepository.save(category);
    return {
      success: true,
      message: "Category created successfully.",
      data: category
    };
  }

  async getAllCategories(
    page: number = 1,
    limit: number = 10
  ): Promise<{ currentPage: number; data: Category[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    console.log(page);
    console.log(limit);
    console.log(skip);
    return {
      totalPages: await this.categoryRepository.count(),
      currentPage: page,
      data: await this.categoryRepository.find({
        skip,
        take: limit,
        order: { createdAt: "DESC" }
      })
    };
  }

  async getCategoryById(
    id: number
  ): Promise<{ success: boolean; data?: Category }> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundError("Category not found.");
    return { success: true, data: category };
  }

  async updateCategory(
    id: number,
    name: string
  ): Promise<{ success: boolean; message: string; data: Category }> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      if (!category) throw new NotFoundError("Category not found.");

    category.name = name;
    await this.categoryRepository.update({ id }, category);
    return {
      success: true,
      message: "Category updated successfully.",
      data: category
    };
  }

  async deleteCategory(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) throw new NotFoundError("Category not found.");
    await this.categoryRepository.remove(category);
    return { success: true, message: "Category deleted successfully." };
  }

  private async _findOneBy(name: string) {
    return this.categoryRepository.findOneBy({ name });
  }
}
