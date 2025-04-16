import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";
import { BrandsService } from "../services";
import { Brand } from "../models/entities/brand.entity";

export class BrandsController {
  private readonly brandsService: BrandsService = new BrandsService();

  createBrand = asyncWrapper(async (req: Request, res: Response) => {
    const brand = await this.brandsService.createBrand(req.body.name);
    SendSuccessResponse<Brand>({
      res,
      data: brand,
      statusCode: 201,
      message: "Brand Created Successfully"
    });
  });

  getAllBrands = asyncWrapper(async (req: Request, res: Response) => {
    const { totalPages, totalItems, data } =
      await this.brandsService.getAllBrands(
        +(req.query?.page || 1),
        +(req.query?.limit || 10),
        req.query?.name as string
      );
    SendSuccessResponse<Brand>({
      res,
      data,
      currentPage: +(req.query?.page || 1),
      totalItems,
      totalPages
    });
  });

  getBrandById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.brandsService.getBrandById(+req.params.brandId);
    SendSuccessResponse<Brand>({
      res,
      data
    });
  });

  updateBrand = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.brandsService.updateBrand(
      +req.params.brandId,
      req.body.name
    );
    SendSuccessResponse<Brand>({
      res,
      data,
      message: "Brand Updated Successfully"
    });
  });

  deleteBrand = asyncWrapper(async (req: Request, res: Response) => {
    await this.brandsService.deleteBrand(+req.params.brandId);
    SendSuccessResponse<Brand>({
      res,
      message: "Brand Deleted Successfully"
    });
  });
}
