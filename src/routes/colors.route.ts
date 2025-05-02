import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { ColorsController } from "../controllers";
import { colorsSchema } from "../schemas";
import { verifyToken } from "../middlewares";
import { allowedTo } from "../middlewares";
import { UserRoles } from "../models";

const router = Router();
const colorsController = new ColorsController();

router
  .route("/")
  .get(
    validateRequestSchema(colorsSchema.getAllColors),
    colorsController.getAllColors
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    validateRequestSchema(colorsSchema.createColor),
    colorsController.createColor
  );

router
  .route("/:colorId")
  .get(colorsController.getColorById)
  .delete(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    colorsController.deleteColor
  );

export default router;
