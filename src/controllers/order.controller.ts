import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { OrderService } from "../services/order.service";
import { User } from "../models";
import { Order } from "../models/entities/order.entity";
import { paginationInput, sendSuccessResponse } from "../utils";

export class OrderController {
  private orderService = new OrderService();

  createOrder = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.orderService.createOrder({
      user: req.user as User,
      body: req.body
    });
    sendSuccessResponse<Order>({
      res,
      data,
      statusCode: 201,
      message: "Order Created Successfully"
    });
  });

  getOrders = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.orderService.getOrders({
      requestParams: req.query as unknown as paginationInput<Order>
    });

    sendSuccessResponse<Order>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getMyOrders = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.orderService.getMyOrders({
      user: req.user as User,
      requestParams: req.query as unknown as paginationInput<Order>
    });

    sendSuccessResponse<Order>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getOrderById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.orderService.getOrderById(
      +req.params.orderId,
      req.user as User
    );
    sendSuccessResponse<Order>({
      res,
      data
    });
  });
}
