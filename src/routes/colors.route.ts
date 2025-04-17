import { Router } from "express";
import { validateRequestSchema } from "../middlewares/validateRequestSchema";
import { ColorsController } from "../controllers/colors.controller";
import { colorsSchema } from "../schemas/colors.schema";

const router = Router();
const colorsController = new ColorsController();

router
  .route("/")
  .get(colorsController.getAllColors)
  .post(
    validateRequestSchema(colorsSchema.createColor),
    colorsController.createColor
  );

router
  .route("/:colorId")
  .get(colorsController.getColorById)
  .delete(colorsController.deleteColor);

export default router;
