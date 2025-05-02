import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { ColorsService } from "../services";
import { sendSuccessResponse } from "../utils";
import { Color } from "../models";
import { paginationInput } from "../utils";

export class ColorsController {
  private readonly colorsService: ColorsService = new ColorsService();

  createColor = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.colorsService.createColor(req.body);
    sendSuccessResponse<Color>({
      res,
      data,
      statusCode: 201,
      message: "Color Created Successfully"
    });
  });

  deleteColor = asyncWrapper(async (req: Request, res: Response) => {
    await this.colorsService.deleteColor(+req.params.colorId);
    sendSuccessResponse<Color>({
      res,
      message: "Color Created Successfully"
    });
  });

  getAllColors = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.colorsService.getAllColors(
      req.query as unknown as paginationInput<Color>
    );
    sendSuccessResponse<Color>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getColorById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.colorsService.getColorById(+req.params.colorId);
    sendSuccessResponse<Color>({
      res,
      data
    });
  });
}
