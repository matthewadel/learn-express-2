import { AppDataSource } from "../models/data-source";
import { Category } from "../models/entities/category.entity";
import { BadRequestError } from "../utils/errors";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(
    name: string
  ): Promise<{ success: boolean; message: string; data?: Category }> {
    try {
      if (await this._findOneBy(name))
        throw new BadRequestError("This Category Already Exists");

      const category = this.categoryRepository.create({ name });
      await this.categoryRepository.save(category);
      return {
        success: true,
        message: "Category created successfully.",
        data: category
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id });
  }

  async updateCategory(
    id: number,
    name: string
  ): Promise<{ success: boolean; message: string }> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      return { success: false, message: "Category not found." };
    }
    category.name = name;
    await this.categoryRepository.save(category);
    return { success: true, message: "Category updated successfully." };
  }

  async deleteCategory(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      return { success: false, message: "Category not found." };
    }
    await this.categoryRepository.remove(category);
    return { success: true, message: "Category deleted successfully." };
  }

  private async _findOneBy(name: string) {
    return this.categoryRepository.findOneBy({ name });
  }
}
