import { Request, Response } from "express";
import { CategoryService } from "../services/categories.service";

export class CategoriesController {
  private readonly categoriesService: CategoryService = new CategoryService();

  getCategories = async (req: Request, res: Response) => {
    const categories = await this.categoriesService.getAllCategories(
      +(req.query?.page || 1),
      +(req.query?.limit || 10)
    );
    res.status(200).send(categories);
  };

  createCategory = async (req: Request, res: Response) => {
    const response = await this.categoriesService.createCategory(req.body.name);
    if (response.success) res.status(201).send(response);
    else res.status(201).send(response);
  };

  getCategoryById = async (req: Request, res: Response) => {
    const response = await this.categoriesService.getCategoryById(
      +req.params.categoryId
    );
    if (response.success) res.status(201).send(response);
    else res.status(200).send(response);
  };
  updateCategory = async (req: Request, res: Response) => {
    const response = await this.categoriesService.updateCategory(
      +req.params.categoryId,
      req.body.name
    );
    if (response.success) res.status(200).send(response);
  };
  deleteCategory = async (req: Request, res: Response) => {
    const response = await this.categoriesService.deleteCategory(
      +req.params.categoryId
    );
    if (response.success) res.status(200).send(response);
  };
}
