import { Request, Response } from "express";
import { CategoryService } from "../services/categories.service";

export class CategoriesController {
  private readonly categoriesService: CategoryService = new CategoryService();

  getCategories = async (req: Request, res: Response) => {
    const categories = await this.categoriesService.getAllCategories();
    res.status(200).send(categories);
  };
  createCategory = async (req: Request, res: Response) => {
    if (req.body.name) {
      const response = await this.categoriesService.createCategory(
        req.body.name
      );
      if (response.success) res.status(201).send(response);
      else res.status(201).send(response);
    } else
      res.status(400).send({ success: false, message: "name is required" });
  };

  getCategoryById = async () => {};
  updateCategory = async () => {};
  deleteCategory = async () => {};
}
