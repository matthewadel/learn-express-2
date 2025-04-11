import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";

const router = Router();
const categoriesController = new CategoriesController();

router
  .route("/")
  .get(categoriesController.getCategories)
  .post(categoriesController.createCategory);

router
  .route("/:categoryId")
  .get(categoriesController.getCategoryById)
  .put(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

export default router;
