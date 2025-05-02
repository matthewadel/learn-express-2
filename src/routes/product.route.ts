import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { ProductsController } from "../controllers";
import { productsSchema } from "../schemas";
import { compressMultipleImages, uploadMultipleImages } from "../middlewares";
import { allowedTo } from "../middlewares";
import { verifyToken } from "../middlewares";
import { UserRoles } from "../models";
import ReviewRouter from "./review.route";

const router = Router();
const productsController = new ProductsController();
router.use("/:productId/review", ReviewRouter);

router
  .route("/")
  .get(
    validateRequestSchema(productsSchema.getAllProducts),
    productsController.getAllProducts
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadMultipleImages([
      { name: "image_cover", maxCount: 1 },
      { name: "images", maxCount: 5 }
    ]),
    compressMultipleImages([
      { fieldName: "image_cover", folderName: "productCovers" },
      { fieldName: "images", folderName: "products" }
    ]),
    validateRequestSchema(productsSchema.createProduct),
    productsController.createProduct
  );

router
  .route("/:productId")
  .get(productsController.getProductById)
  .put(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    uploadMultipleImages([
      { name: "image_cover", maxCount: 1 },
      { name: "images", maxCount: 5 }
    ]),
    compressMultipleImages([
      { fieldName: "image_cover", folderName: "productCovers" },
      { fieldName: "images", folderName: "products" }
    ]),
    validateRequestSchema(productsSchema.updateProduct),
    productsController.updateProduct
  )
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    productsController.deleteProduct
  );

export default router;
