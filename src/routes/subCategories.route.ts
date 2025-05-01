import { subCategoriesSchema } from "./../schemas/subCategories.schema";
import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { SubCategoryController } from "../controllers/subCategories.controller";
import { allowedTo } from "../middlewares/allowedTo";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRoles } from "../models/entities/user.entity";

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
