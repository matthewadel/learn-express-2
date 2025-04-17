import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { ColorsService } from "../services/colors.service";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";
import { Color } from "../models/entities/color.entity";

export class ColorsController {
  private readonly colorsService: ColorsService = new ColorsService();

  createColor = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.colorsService.createColor(req.body.name);
    SendSuccessResponse<Color>({
      res,
      data,
      message: "Color Created Successfully"
    });
  });

  deleteColor = asyncWrapper(async (req: Request, res: Response) => {
    await this.colorsService.deleteColor(+req.params.colorId);
    SendSuccessResponse<Color>({
      res,
      message: "Color Created Successfully"
    });
  });

  getAllColors = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.colorsService.getAllColors(
      +(req.query?.page ?? 1),
      +(req.query?.limit ?? 10),
      req.query.name as string
    );
    SendSuccessResponse<Color>({
      res,
      currentPage: +(req.query?.page ?? 1),
      ...response
    });
  });

  getColorById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.colorsService.getColorById(+req.params.colorId);
    SendSuccessResponse<Color>({
      res,
      data
    });
  });
}
