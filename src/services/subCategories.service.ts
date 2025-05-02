import { AppDataSource } from "../models";
import { SubCategory } from "../models";
import { BadRequestError, NotFoundError } from "../utils";
import { findOneBy } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { subCategoriesSchema } from "../schemas";
import { z } from "zod";
import { CategoryService } from "./categories.service";

type CreateSubCategoryBody = z.infer<
  typeof subCategoriesSchema.createSubCategory
>;
type UpdateSubCategoryBody = z.infer<
  typeof subCategoriesSchema.updateSubCategory
>;

export class SubCategoriesService {
  private subCategoryRepository = AppDataSource.getRepository(SubCategory);
  private categoryService = new CategoryService();

  // Create a new sub-category
  async createSubCategory({
    ...body
  }: CreateSubCategoryBody["body"]): Promise<SubCategory> {
    const parentCategory = await this._findParentCategoryBy({
      id: body.parentCategoryId
    });
    if (!parentCategory) throw new NotFoundError("Parent Category Not Found");

    const cat = await this.getSubCategoryByName(body.name);
    if (cat) throw new BadRequestError("This SubCategory Already Exists");

    return this.subCategoryRepository.save({
      ...body,
      parent_category: parentCategory
    });
  }

  // Get all sub-categories
  async getAllSubCategories(
    requestParams: paginationInput<SubCategory>,
    parentCategoryId?: number
  ) {
    return await getPaginatedResultsWithFilter<SubCategory>({
      entity: SubCategory,
      getImtesParams: requestParams,
      search_columns: ["name"],
      inputOptions: {
        where: parentCategoryId
          ? { parent_category: { id: parentCategoryId } }
          : {},
        relations: ["parent_category"]
      }
    });
  }

  // Get a single sub-category by ID
  async getSubCategoryById(id: number): Promise<SubCategory> {
    return findOneBy<SubCategory>(SubCategory, {
      id,
      options: { relations: ["parent_category"] }
    });
  }

  async getSubCategoryByName(name: string): Promise<SubCategory> {
    return findOneBy<SubCategory>(SubCategory, {
      name,
      options: { relations: ["parent_category"] },
      checkExistence: true
    });
  }

  // Update a sub-category
  async updateSubCategory(
    id: number,
    body: UpdateSubCategoryBody["body"]
  ): Promise<SubCategory> {
    const subCategory = await this.getSubCategoryById(id);

    if (body.parentCategoryId) {
      const parentCategory = await this._findParentCategoryBy({
        id: body.parentCategoryId
      });
      subCategory.parent_category = parentCategory;
      delete body.parentCategoryId;
    }
    await this.subCategoryRepository.save({ ...subCategory, ...body });

    return subCategory;
  }

  // Delete a sub-category
  async deleteSubCategory(id: number): Promise<void> {
    const subCategory = await this.getSubCategoryById(id);

    await this.subCategoryRepository.remove(subCategory);
  }

  private async _findParentCategoryBy({ id }: { id: number }) {
    return this.categoryService.getCategoryById(id);
  }
}
