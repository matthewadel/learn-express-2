import { subCategoriesSchema } from "./../schemas";
import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { SubCategoryController } from "../controllers";
import { allowedTo } from "../middlewares";
import { verifyToken } from "../middlewares";
import { UserRoles } from "../models";

const router = Router({ mergeParams: true });
const subcategoriesController = new SubCategoryController();

router
  .route("/")
  .get(
    validateRequestSchema(subCategoriesSchema.getAllSubCategories),
    subcategoriesController.getAllSubCategories
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    subcategoriesController.setCategoryIdToBody,
    validateRequestSchema(subCategoriesSchema.createSubCategory),
    subcategoriesController.createSubCategory
  );

router
  .route("/:subCategoryId")
  .get(subcategoriesController.getSubCategoryBy)
  .put(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    validateRequestSchema(subCategoriesSchema.updateSubCategory),
    subcategoriesController.updateSubCategory
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    subcategoriesController.deleteSubCategory
  );

export default router;
