import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils";

const createCity = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, { message: "Name must be at least 1 character long" })
  })
});

const updateCity = z.object({
  body: createCity.shape.body.deepPartial()
});

const getAllCities = getALlItemsValidationWithPagination(
  createCity.shape.body.shape
);

export const citySchema = {
  createCity,
  updateCity,
  getAllCities
};
