import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { ProductsController } from "../controllers/products.controller";
import { productsSchema } from "../schemas/products.schema";
import {
  compressMultipleImages,
  uploadMultipleImages
} from "../middlewares/uploadMultipleImages";

const router = Router();
const productsController = new ProductsController();

router
  .route("/")
  .get(
    validateRequestSchema(productsSchema.getAllProducts),
    productsController.getAllProducts
  )
  .post(
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
  .delete(productsController.deleteProduct);

export default router;
