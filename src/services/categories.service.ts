import { AppDataSource } from "../models";
import { BadRequestError } from "../utils";
import { Category } from "../models";
import { findOneBy } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { categoriesSchema } from "../schemas";
import { z } from "zod";

type CreateCategotyBody = z.infer<typeof categoriesSchema.createCategory>;
type UpdateCategoryBody = z.infer<typeof categoriesSchema.updateCategory>;

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(body: CreateCategotyBody["body"]): Promise<Category> {
    const cat = await this.categoryRepository.findOneBy({ name: body.name });
    if (cat) throw new BadRequestError("This Category Already Exists");

    return await this.categoryRepository.save(body);
  }

  async getAllCategories(requestParams: paginationInput<Category>) {
    return await getPaginatedResultsWithFilter<Category>({
      entity: Category,
      getImtesParams: requestParams,
      search_columns: ["name"]
    });
  }

  // async getSubCategoriesInsideCategory(
  //   categoryId: number,
  //   requestParams: paginationInput<SubCategory>
  // ) {
  //   return await getPaginatedResultsWithFilter<SubCategory>(
  //     SubCategory,
  //     requestParams,
  //     ["name"],
  //     { where: [{ parent_category: { id: categoryId } }] }
  //   );
  // }

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
