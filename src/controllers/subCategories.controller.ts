import { SubCategoriesService } from "../services/subCategories.service";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { Request, Response } from "express";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";
import { SubCategory } from "../models/entities/subCategory.entity";
import { paginationInput } from "../utils/getPaginatedResultsWithFilter";

export class SubCategoryController {
  private readonly subCategoriesService: SubCategoriesService =
    new SubCategoriesService();

  createSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    const category = await this.subCategoriesService.createSubCategory({
      name: req.body.name,
      parentCategoryId: +req.body.parentCategoryId
    });
    SendSuccessResponse<SubCategory>({
      res,
      data: category,
      statusCode: 201,
      message: "Category Created Successfully"
    });
  });

  getAllSubCategories = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.subCategoriesService.getAllSubCategories(
      req.query as unknown as paginationInput<SubCategory>
    );
    SendSuccessResponse<SubCategory>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getSubCategoryBy = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.subCategoriesService.getSubCategoryBy(
      +req.params.subCategoryId
    );
    SendSuccessResponse<SubCategory>({
      res,
      data
    });
  });

  updateSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    const { subCategoryId } = req.params;
    const { name, image, parentCategoryId } = req.body;

    const data = await this.subCategoriesService.updateSubCategory(
      +subCategoryId,
      name,
      image,
      parentCategoryId
    );
    SendSuccessResponse<SubCategory>({
      res,
      data,
      message: "Category Updated Successfully"
    });
  });

  deleteSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    await this.subCategoriesService.deleteSubCategory(
      +req.params.subCategoryId
    );
    SendSuccessResponse<SubCategory>({
      res,
      message: "Category Deleted Successfully"
    });
  });
}
