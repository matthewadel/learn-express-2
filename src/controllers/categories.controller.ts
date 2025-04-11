import { Request, Response } from "express";

export class CategoriesController {
  getCategories = async (req: Request, res: Response) => {
    res.send([{ name: "1" }]);
  };
  createCategory = async () => {};
  getCategoryById = async () => {};
  updateCategory = async () => {};
  deleteCategory = async () => {};
}
