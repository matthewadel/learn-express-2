import { Request, Response } from "express";
import { CategoryService } from "../services";
import { asyncWrapper } from "../middlewares";
import { sendSuccessResponse } from "../utils";
import { Category } from "../models";
import { paginationInput } from "../utils";

export class CategoriesController {
  private readonly categoriesService: CategoryService = new CategoryService();

  createCategory = asyncWrapper(async (req: Request, res: Response) => {
    const category = await this.categoriesService.createCategory(req.body);
    sendSuccessResponse<Category>({
      res,
      data: category,
      statusCode: 201,
      message: "Category Created Successfully"
    });
  });

  getAllCategories = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.categoriesService.getAllCategories(
      req.query as unknown as paginationInput<Category>
    );
    sendSuccessResponse<Category>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getCategoryById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.categoriesService.getCategoryById(
      +req.params.categoryId
    );
    sendSuccessResponse<Category>({
      res,
      data
    });
  });

  // getSubCategoriesInsideCategory = asyncWrapper(
  //   async (req: Request, res: Response) => {
  //     const response =
  //       await this.categoriesService.getSubCategoriesInsideCategory(
  //         +req.params?.categoryId,
  //         req.query as unknown as paginationInput<SubCategory>
  //       );
  //     sendSuccessResponse<SubCategory>({
  //       res,
  //       currentPage: +(req.query?.page || 1),
  //       ...response
  //     });
  //   }
  // );

  updateCategory = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.categoriesService.updateCategory(
      +req.params.categoryId,
      req.body
    );
    sendSuccessResponse<Category>({
      res,
      data,
      message: "Category Updated Successfully"
    });
  });

  deleteCategory = asyncWrapper(async (req: Request, res: Response) => {
    await this.categoriesService.deleteCategory(+req.params.categoryId);
    sendSuccessResponse<Category>({
      res,
      message: "Category Deleted Successfully"
    });
  });
}
