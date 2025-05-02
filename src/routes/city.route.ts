import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { allowedTo } from "../middlewares";
import { verifyToken } from "../middlewares";
import { UserRoles } from "../models";
import { CityController } from "../controllers/city.controller";
import { citySchema } from "../schemas/city.schema";

const router = Router();
const cityController = new CityController();

router
  .route("/")
  .get(
    validateRequestSchema(citySchema.getAllCities),
    cityController.getAllCities
  )
  .post(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    validateRequestSchema(citySchema.createCity),
    cityController.createCity
  );

router
  .route("/:cityId")
  .get(cityController.getCityById)
  .put(
    verifyToken,
    allowedTo([UserRoles.ADMIN]),
    validateRequestSchema(citySchema.updateCity),
    cityController.updateCity
  )
  .delete(verifyToken, allowedTo([UserRoles.ADMIN]), cityController.deleteCity);

export default router;
