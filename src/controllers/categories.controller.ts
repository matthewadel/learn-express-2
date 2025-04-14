import { Request, Response } from "express";
import { CategoryService } from "../services/categories.service";
import { asyncWrapper } from "../middlewares/asyncWrapper";

export class CategoriesController {
  private readonly categoriesService: CategoryService = new CategoryService();

  getCategories = asyncWrapper(async (req: Request, res: Response) => {
    const categories = await this.categoriesService.getAllCategories(
      +(req.query?.page || 1),
      +(req.query?.limit || 10)
    );
    res.status(200).send(categories);
  });

  createCategory = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.categoriesService.createCategory(req.body.name);
    if (response.success) res.status(201).send(response);
    else res.status(201).send(response);
  });

  getCategoryById = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.categoriesService.getCategoryById(
      +req.params.categoryId
    );
    if (response.success) res.status(201).send(response);
    else res.status(200).send(response);
  });

  updateCategory = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.categoriesService.updateCategory(
      +req.params.categoryId,
      req.body.name
    );
    if (response.success) res.status(200).send(response);
  });

  deleteCategory = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.categoriesService.deleteCategory(
      +req.params.categoryId
    );
    if (response.success) res.status(200).send(response);
  });
}
