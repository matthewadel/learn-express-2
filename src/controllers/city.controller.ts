import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { sendSuccessResponse } from "../utils";
import { CityService } from "../services";
import { City } from "../models";
import { paginationInput } from "../utils";

export class CityController {
  private readonly cityService: CityService = new CityService();

  createCity = asyncWrapper(async (req: Request, res: Response) => {
    const city = await this.cityService.createCity(req.body);
    sendSuccessResponse<City>({
      res,
      data: city,
      statusCode: 201,
      message: "City Created Successfully",
    });
  });

  getAllCities = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.cityService.getAllCities(
      req.query as unknown as paginationInput<City>
    );
    sendSuccessResponse<City>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response,
    });
  });

  getCityById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.cityService.getCityById(+req.params.cityId);
    sendSuccessResponse<City>({
      res,
      data,
    });
  });

  updateCity = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.cityService.updateCity(+req.params.cityId, req.body);
    sendSuccessResponse<City>({
      res,
      data,
      message: "City Updated Successfully",
    });
  });

  deleteCity = asyncWrapper(async (req: Request, res: Response) => {
    await this.cityService.deleteCity(+req.params.cityId);
    sendSuccessResponse<City>({
      res,
      message: "City Deleted Successfully",
    });
  });
}