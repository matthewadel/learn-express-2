import { Router } from "express";
import { CategoriesController } from "../controllers";
import { categoriesSchema } from "../schemas";
import { validateRequestSchema } from "../middlewares";
import { compressSingleImage, uploadSingleImage } from "../middlewares";
import { verifyToken } from "../middlewares";
import { allowedTo } from "../middlewares";
import { UserRoles } from "../models";
import subCategoriesRouter from "./subCategories.route";

const router = Router();
const categoriesController = new CategoriesController();

router
  .route("/")
  .get(
    validateRequestSchema(categoriesSchema.getAllCategories),
    categoriesController.getAllCategories
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadSingleImage("image"),
    compressSingleImage("category", "categories"),
    validateRequestSchema(categoriesSchema.createCategory),
    categoriesController.createCategory
  );

router
  .route("/:categoryId")
  .get(categoriesController.getCategoryById)
  .put(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadSingleImage("image"),
    compressSingleImage("category", "categories"),
    validateRequestSchema(categoriesSchema.updateCategory),
    categoriesController.updateCategory
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    categoriesController.deleteCategory
  );

router.use("/:categoryId/sub-categories", subCategoriesRouter);
// router
//   .route("/:categoryId/sub-categories")
//   .get(categoriesController.getSubCategoriesInsideCategory);

export default router;
