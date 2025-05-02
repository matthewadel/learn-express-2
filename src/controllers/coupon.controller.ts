import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { sendSuccessResponse } from "../utils";
import { CouponsService } from "../services";
import { Coupon } from "../models";
import { paginationInput } from "../utils";

export class CouponsController {
  private readonly couponsService: CouponsService = new CouponsService();

  createCoupon = asyncWrapper(async (req: Request, res: Response) => {
    const coupon = await this.couponsService.createCoupon(req.body);
    sendSuccessResponse<Coupon>({
      res,
      data: coupon,
      statusCode: 201,
      message: "Coupon Created Successfully"
    });
  });

  getAllCoupons = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.couponsService.getAllCoupons(
      req.query as unknown as paginationInput<Coupon>
    );
    sendSuccessResponse<Coupon>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getCouponById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.couponsService.getCouponById(+req.params.couponId);
    sendSuccessResponse<Coupon>({
      res,
      data
    });
  });

  updateCoupon = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.couponsService.updateCoupon(
      +req.params.couponId,
      req.body
    );
    sendSuccessResponse<Coupon>({
      res,
      data,
      message: "Coupon Updated Successfully"
    });
  });

  deleteCoupon = asyncWrapper(async (req: Request, res: Response) => {
    await this.couponsService.deleteCoupon(+req.params.couponId);
    sendSuccessResponse<Coupon>({
      res,
      message: "Coupon Deleted Successfully"
    });
  });
}