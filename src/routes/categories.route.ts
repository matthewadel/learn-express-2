import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { categoriesSchema } from "../schemas/categories.schema";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();
const categoriesController = new CategoriesController();

router
  .route("/")
  .get(categoriesController.getCategories)
  .post(
    validateRequest(categoriesSchema.createCategory),
    categoriesController.createCategory
  );

router
  .route("/:categoryId")
  .get(categoriesController.getCategoryById)
  .put(
    validateRequest(categoriesSchema.updateCategory),
    categoriesController.updateCategory
  )
  .delete(categoriesController.deleteCategory);

export default router;
