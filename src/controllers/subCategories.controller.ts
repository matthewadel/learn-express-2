import { SubCategoriesService } from "../services/subCategories.service";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../utils/sendSuccessResponse";
import { SubCategory } from "../models/entities/subCategory.entity";
import { paginationInput } from "../utils/getPaginatedResultsWithFilter";

export class SubCategoryController {
  private readonly subCategoriesService: SubCategoriesService =
    new SubCategoriesService();

  createSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    const category = await this.subCategoriesService.createSubCategory(
      req.body
    );
    sendSuccessResponse<SubCategory>({
      res,
      data: category,
      statusCode: 201,
      message: "Category Created Successfully"
    });
  });

  getAllSubCategories = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.subCategoriesService.getAllSubCategories(
      req.query as unknown as paginationInput<SubCategory>,
      +req.params.categoryId
    );
    sendSuccessResponse<SubCategory>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getSubCategoryBy = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.subCategoriesService.getSubCategoryBy(
      +req.params.subCategoryId
    );
    sendSuccessResponse<SubCategory>({
      res,
      data
    });
  });

  updateSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    const { subCategoryId } = req.params;

    const data = await this.subCategoriesService.updateSubCategory(
      +subCategoryId,
      req.body
    );
    sendSuccessResponse<SubCategory>({
      res,
      data,
      message: "Category Updated Successfully"
    });
  });

  deleteSubCategory = asyncWrapper(async (req: Request, res: Response) => {
    await this.subCategoriesService.deleteSubCategory(
      +req.params.subCategoryId
    );
    sendSuccessResponse<SubCategory>({
      res,
      message: "Category Deleted Successfully"
    });
  });

  setCategoryIdToBody = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.parentCategoryId && req.params.categoryId)
        req.body.parentCategoryId = +req.params.categoryId;
      next();
    }
  );
}
