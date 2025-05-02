import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { brandsSchema } from "../schemas";
import { BrandsController } from "../controllers";
import { compressSingleImage, uploadSingleImage } from "../middlewares";
import { verifyToken } from "../middlewares";
import { allowedTo } from "../middlewares";
import { UserRoles } from "../models";

const router = Router();
const brandsController = new BrandsController();

router
  .route("/")
  .get(
    validateRequestSchema(brandsSchema.getAllBrands),
    brandsController.getAllBrands
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadSingleImage("image"),
    compressSingleImage("image", "brand", "brands"),
    validateRequestSchema(brandsSchema.createBrand),
    brandsController.createBrand
  );

router
  .route("/:brandId")
  .get(brandsController.getBrandById)
  .put(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadSingleImage("image"),
    compressSingleImage("image", "brand", "brands"),
    validateRequestSchema(brandsSchema.updateBrand),
    brandsController.updateBrand
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    brandsController.deleteBrand
  );

export default router;
