import { AppDataSource } from "../models/data-source";
import { SubCategory } from "../models/entities/subCategory.entity";
import { Category } from "../models/entities/category.entity";
import { BadRequestError, NotFoundError } from "../utils/errors";

export class SubCategoriesService {
  private subCategoryRepository = AppDataSource.getRepository(SubCategory);
  private categoryRepository = AppDataSource.getRepository(Category);

  // Create a new sub-category
  async createSubCategory({
    name,
    image,
    parentCategoryId
  }: {
    name: string;
    image?: string;
    parentCategoryId: number;
  }): Promise<SubCategory> {
    const parentCategory = await this._findParentCategoryBy({
      id: parentCategoryId
    });
    const cat = await this.subCategoryRepository.findOneBy({ name });
    if (cat) throw new BadRequestError("This SubCategory Already Exists");

    const subCategory = this.subCategoryRepository.create({
      name,
      image,
      parentCategory: parentCategory
    });

    return subCategory;
  }

  // Get all sub-categories
  async getAllSubCategories(
    page: number,
    limit: number
  ): Promise<{
    data: SubCategory[];
    totalPages: number;
    totalItems: number;
  }> {
    const skip = (page - 1) * limit;

    const totalItems = await this.subCategoryRepository.count();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      totalPages,
      totalItems,
      data: await this.subCategoryRepository.find({
        relations: ["parentCategory"],
        skip,
        take: limit,
        order: { createdAt: "DESC" }
      })
    };
  }

  // Get a single sub-category by ID
  async getSubCategoryById(id: number): Promise<SubCategory> {
    const category = await this._findOneBy({ id });
    return category;
  }

  // Update a sub-category
  async updateSubCategory(
    id: number,
    name?: string,
    image?: string,
    parentCategoryId?: number
  ): Promise<SubCategory> {
    const subCategory = await this._findOneBy({ id });

    if (name) subCategory.name = name;
    if (image) subCategory.image = image;

    if (parentCategoryId) {
      const parentCategory = await this._findParentCategoryBy({
        id: parentCategoryId
      });
      subCategory.parentCategory = parentCategory;
    }
    await this.subCategoryRepository.update({ id }, subCategory);

    return subCategory;
  }

  // Delete a sub-category
  async deleteSubCategory(id: number): Promise<void> {
    const subCategory = await this._findOneBy({ id });

    await this.subCategoryRepository.remove(subCategory);
  }

  private async _findOneBy({ id, name }: { id?: number; name?: string }) {
    const category = await this.subCategoryRepository.findOne({
      where: { id, name },
      relations: ["parentCategory"]
    });
    if (!category) throw new NotFoundError("Sub Category not found.");
    return category;
  }

  private async _findParentCategoryBy({ id }: { id?: number }) {
    let parentCategory: Category | null = null;
    if (id) {
      parentCategory = await this.categoryRepository.findOneBy({
        id
      });
      if (!parentCategory) throw new NotFoundError("Parent category not found");
    } else throw new BadRequestError("Parent category Id Not Found");
    return parentCategory;
  }
}
