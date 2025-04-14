import { Request, Response } from "express";
import { CategoryService } from "../services/categories.service";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";

export class CategoriesController {
  private readonly categoriesService: CategoryService = new CategoryService();

  createCategory = asyncWrapper(async (req: Request, res: Response) => {
    const category = await this.categoriesService.createCategory(req.body.name);
    SendSuccessResponse({
      res,
      data: category,
      statusCode: 201,
      message: "Category Created Successfully"
    });
  });

  getCategories = asyncWrapper(async (req: Request, res: Response) => {
    const { totalPages, totalItems, data } =
      await this.categoriesService.getAllCategories(
        +(req.query?.page || 1),
        +(req.query?.limit || 10)
      );
    SendSuccessResponse({
      res,
      data,
      currentPage: +(req.query?.page || 1),
      totalItems,
      totalPages
    });
  });

  getCategoryById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.categoriesService.getCategoryById(
      +req.params.categoryId
    );
    SendSuccessResponse({
      res,
      data
    });
  });

  updateCategory = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.categoriesService.updateCategory(
      +req.params.categoryId,
      req.body.name
    );
    SendSuccessResponse({
      res,
      data,
      message: "Category Updated Successfully"
    });
  });

  deleteCategory = asyncWrapper(async (req: Request, res: Response) => {
    await this.categoriesService.deleteCategory(+req.params.categoryId);
    SendSuccessResponse({
      res,
      message: "Category Deleted Successfully"
    });
  });
}
