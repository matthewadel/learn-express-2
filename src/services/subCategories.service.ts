import { AppDataSource } from "../models/data-source";
import { SubCategory } from "../models/entities/sub-category.entity";
import { Category } from "../models/entities/category.entity";

export class SubCategoriesService {
  private subCategoryRepository = AppDataSource.getRepository(SubCategory);
  private categoryRepository = AppDataSource.getRepository(Category);

  // Create a new sub-category
  async createSubCategory(
    name: string,
    image: string,
    parentCategoryId: number
  ): Promise<SubCategory> {
    const parentCategory = await this.categoryRepository.findOneBy({
      id: parentCategoryId
    });
    if (!parentCategory) {
      throw new Error("Parent category not found");
    }

    const subCategory = this.subCategoryRepository.create({
      name,
      image,
      parentCategory: parentCategory
    });

    return this.subCategoryRepository.save(subCategory);
  }

  // Get all sub-categories
  async getAllSubCategories(): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      relations: ["parentCategory"]
    });
  }

  // Get a single sub-category by ID
  async getSubCategoryById(id: number): Promise<SubCategory | null> {
    return await this.subCategoryRepository.findOne({
      where: { id },
      relations: ["parentCategory"]
    });
  }

  // Update a sub-category
  async updateSubCategory(
    id: number,
    name?: string,
    image?: string,
    parentCategoryId?: number
  ): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOneBy({ id });
    if (!subCategory) {
      throw new Error("Sub-category not found");
    }

    if (name) subCategory.name = name;
    if (image) subCategory.image = image;

    if (parentCategoryId) {
      const parentCategory = await this.categoryRepository.findOneBy({
        id: parentCategoryId
      });
      if (!parentCategory) {
        throw new Error("Parent category not found");
      }
      subCategory.parentCategory = parentCategory;
    }

    return await this.subCategoryRepository.save(subCategory);
  }

  // Delete a sub-category
  async deleteSubCategory(id: number): Promise<void> {
    const subCategory = await this.subCategoryRepository.findOneBy({ id });
    if (!subCategory) {
      throw new Error("Sub-category not found");
    }

    await this.subCategoryRepository.remove(subCategory);
  }
}
