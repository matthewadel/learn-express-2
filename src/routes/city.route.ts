import { Router } from "express";
import { validateRequestSchema } from "../middlewares";
import { allowedTo } from "../middlewares";
import { verifyToken } from "../middlewares";
import { UserRoles } from "../models";
import { CityController } from "../controllers/city.controller";
import { citySchema } from "../schemas/city.schema";

const router = Router();
const cityController = new CityController();

router.use(verifyToken, allowedTo([UserRoles.ADMIN]));

router
  .route("/")
  .get(
    validateRequestSchema(citySchema.getAllCities),
    cityController.getAllCities
  )
  .post(
    validateRequestSchema(citySchema.createCity),
    cityController.createCity
  );

router
  .route("/:cityId")
  .get(cityController.getCityById)
  .put(validateRequestSchema(citySchema.updateCity), cityController.updateCity)
  .delete(cityController.deleteCity);

export default router;
