import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { brandsSchema } from "../schemas";
import { BrandsController } from "../controllers";
import {
  compressSingleImage,
  uploadSingleImage
} from "../middlewares/uploadSingleImage";

const router = Router();
const brandsController = new BrandsController();

router
  .route("/")
  .get(
    validateRequestSchema(brandsSchema.getAllBrands),
    brandsController.getAllBrands
  )
  .post(
    uploadSingleImage("image"),
    compressSingleImage("brand", "brands"),
    validateRequestSchema(brandsSchema.createBrand),
    brandsController.createBrand
  );

router
  .route("/:brandId")
  .get(brandsController.getBrandById)
  .put(
    uploadSingleImage("image"),
    compressSingleImage("brand", "brands"),
    validateRequestSchema(brandsSchema.updateBrand),
    brandsController.updateBrand
  )
  .delete(brandsController.deleteBrand);

export default router;
