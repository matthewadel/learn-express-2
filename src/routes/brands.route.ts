import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { brandsSchema } from "../schemas";
import { BrandsController } from "../controllers";
import {
  compressSingleImage,
  uploadSingleImage
} from "../middlewares/uploadSingleImage";
import { verifyToken } from "../middlewares/verifyToken";
import { allowedTo } from "../middlewares/allowedTo";
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
    compressSingleImage("brand", "brands"),
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
    compressSingleImage("brand", "brands"),
    validateRequestSchema(brandsSchema.updateBrand),
    brandsController.updateBrand
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    brandsController.deleteBrand
  );

export default router;
