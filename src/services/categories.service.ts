import { AppDataSource } from "../models/data-source";
import { Category } from "../models/entities/category.entity";
import { BadRequestError, NotFoundError } from "../utils/errors";

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
    limit: number = 10
  ): Promise<{
    data: Category[];
    totalPages: number;
    totalItems: number;
  }> {
    const skip = (page - 1) * limit;

    const totalItems = await this.categoryRepository.count();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      totalPages,
      totalItems,
      data: await this.categoryRepository.find({
        skip,
        take: limit,
        order: { createdAt: "DESC" }
      })
    };
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
