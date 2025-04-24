import { AppDataSource } from "../models/data-source";
import { SubCategory } from "../models/entities/subCategory.entity";
import { Category } from "../models/entities/category.entity";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { findOneBy } from "../utils/findOneBy";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";
import { subCategoriesSchema } from "../schemas";
import { z } from "zod";

type CreateSubCategoryBody = z.infer<
  typeof subCategoriesSchema.createSubCategory
>;
type UpdateSubCategoryBody = z.infer<
  typeof subCategoriesSchema.updateSubCategory
>;

export class SubCategoriesService {
  private subCategoryRepository = AppDataSource.getRepository(SubCategory);
  private categoryRepository = AppDataSource.getRepository(Category);

  // Create a new sub-category
  async createSubCategory({
    ...body
  }: CreateSubCategoryBody["body"]): Promise<SubCategory> {
    const parentCategory = await this._findParentCategoryBy({
      id: body.parentCategoryId
    });
    if (!parentCategory) throw new NotFoundError("Parent Category Not Found");

    const cat = await this.subCategoryRepository.findOneBy({ name: body.name });
    if (cat) throw new BadRequestError("This SubCategory Already Exists");

    const subCategory = this.subCategoryRepository.create({
      ...body,
      parent_category: parentCategory
    });

    return this.subCategoryRepository.save(subCategory);
  }

  // Get all sub-categories
  async getAllSubCategories(requestParams: paginationInput<SubCategory>) {
    return await getPaginatedResultsWithFilter<SubCategory>(
      SubCategory,
      requestParams,
      ["name"],
      {
        relations: ["parent_category"]
      }
    );
  }

  // Get a single sub-category by ID
  async getSubCategoryBy(id: number): Promise<SubCategory> {
    const category = await findOneBy<SubCategory>(SubCategory, {
      id,
      options: { relations: ["parent_category"] }
    });
    return category;
  }

  // Update a sub-category
  async updateSubCategory(
    id: number,
    body: UpdateSubCategoryBody["body"]
  ): Promise<SubCategory> {
    const subCategory = await findOneBy<SubCategory>(SubCategory, {
      id
    });

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
    const subCategory = await findOneBy<SubCategory>(SubCategory, {
      id
    });

    await this.subCategoryRepository.remove(subCategory);
  }

  private async _findParentCategoryBy({ id }: { id: number }) {
    let parentCategory: Category | null = null;

    parentCategory = await this.categoryRepository.findOneBy({
      id
    });
    if (!parentCategory) throw new NotFoundError("Parent category not found");

    return parentCategory;
  }
}
