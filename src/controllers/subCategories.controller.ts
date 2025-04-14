import { SubCategoriesService } from "../services/subCategories.service";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { Request, Response } from "express";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";
import { SubCategory } from "../models/entities/subCategory.entity";

export class SubCategoryController {
  private readonly subCategoriesService: SubCategoriesService =
    new SubCategoriesService();

  createSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    const category = await this.subCategoriesService.createSubCategory(
      req.body.name
    );
    SendSuccessResponse<SubCategory>({
      res,
      data: category,
      statusCode: 201,
      message: "Category Created Successfully"
    });
  });

  getAllSubCategories = asyncWrapper(async (req: Request, res: Response) => {
    const { totalPages, totalItems, data } =
      await this.subCategoriesService.getAllSubCategories(
        +(req.query?.page || 1),
        +(req.query?.limit || 10)
      );
    SendSuccessResponse<SubCategory>({
      res,
      data,
      currentPage: +(req.query?.page || 1),
      totalItems,
      totalPages
    });
  });

  getSubCategoryById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.subCategoriesService.getSubCategoryById(
      +req.params.categoryId
    );
    SendSuccessResponse<SubCategory>({
      res,
      data
    });
  });

  updateSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, categoryId, image } = req.body;
    const data = await this.subCategoriesService.updateSubCategory(
      +id,
      name,
      categoryId,
      image
    );
    SendSuccessResponse<SubCategory>({
      res,
      data,
      message: "Category Updated Successfully"
    });
  });

  deleteSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    await this.subCategoriesService.deleteSubCategory(+req.params.categoryId);
    SendSuccessResponse<SubCategory>({
      res,
      message: "Category Deleted Successfully"
    });
  });
}
