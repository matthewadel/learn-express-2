import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { ProductsController } from "../controllers/products.controller";
import { productsSchema } from "../schemas/products.schema";

const router = Router();
const productsController = new ProductsController();

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(
    validateRequestSchema(productsSchema.createProduct),
    productsController.createProduct
  );

router
  .route("/:productId")
  .get(productsController.getProductById)
  .put(
    validateRequestSchema(productsSchema.updateProduct),
    productsController.updateProduct
  )
  .delete(productsController.deleteProduct);

export default router;
