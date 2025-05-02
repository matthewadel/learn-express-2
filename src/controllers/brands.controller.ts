import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { sendSuccessResponse } from "../utils";
import { BrandsService } from "../services";
import { Brand } from "../models";
import { paginationInput } from "../utils";

export class BrandsController {
  private readonly brandsService: BrandsService = new BrandsService();

  createBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brand = await this.brandsService.createBrand(req.body);
    sendSuccessResponse<Brand>({
      res,
      data: brand,
      statusCode: 201,
      message: "Brand Created Successfully"
    });
  });

  getAllBrands = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.brandsService.getAllBrands(
      req.query as unknown as paginationInput<Brand>
    );
    sendSuccessResponse<Brand>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getBrandById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.brandsService.getBrandById(+req.params.brandId);
    sendSuccessResponse<Brand>({
      res,
      data
    });
  });

  updateBrand = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.brandsService.updateBrand(
      +req.params.brandId,
      req.body
    );
    sendSuccessResponse<Brand>({
      res,
      data,
      message: "Brand Updated Successfully"
    });
  });

  deleteBrand = asyncWrapper(async (req: Request, res: Response) => {
    await this.brandsService.deleteBrand(+req.params.brandId);
    sendSuccessResponse<Brand>({
      res,
      message: "Brand Deleted Successfully"
    });
  });
}
