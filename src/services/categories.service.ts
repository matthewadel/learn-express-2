import { AppDataSource } from "../models/data-source";
import { Category } from "../models/entities/category.entity";
import { SubCategory } from "../models/entities/subCategory.entity";
import { BadRequestError } from "../utils/errors";
import { findOneBy } from "../utils/findOneBy";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(name: string): Promise<Category> {
    const cat = await this.categoryRepository.findOneBy({ name });
    if (cat) throw new BadRequestError("This Category Already Exists");

    const category = this.categoryRepository.create({ name });
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
