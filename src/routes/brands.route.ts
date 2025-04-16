import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { brandsSchema } from "../schemas";
import { BrandsController } from "../controllers";

const router = Router();
const brandsController = new BrandsController();

router
  .route("/")
  .get(brandsController.getAllBrands)
  .post(
    validateRequestSchema(brandsSchema.createBrand),
    brandsController.createBrand
  );

router
  .route("/:brandId")
  .get(brandsController.getBrandById)
  .put(
    validateRequestSchema(brandsSchema.updateBrand),
    brandsController.updateBrand
  )
  .delete(brandsController.deleteBrand);

export default router;
