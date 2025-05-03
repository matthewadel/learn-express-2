import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { User } from "../models";
import { CartService } from "../services";
import { paginationInput, sendSuccessResponse } from "../utils";
import { CartProducts } from "../models/entities/cartProducts.entity";
import { Cart } from "../models/entities/cart.entity";

export class CartController {
  private cartService = new CartService();

  addToCart = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.cartService.addToCart({
      user: req.user as User,
      body: req.body
    });
    sendSuccessResponse<CartProducts>({
      res,
      data,
      message: "Product Added To Cart Successfully"
    });
  });

  getMyCart = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.cartService.getMyCart({
      user: req.user as User
    });
    sendSuccessResponse<Cart[]>({
      res,
      data
    });
  });

  getMyCartProducts = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.cartService.getCartProducts({
      user: req.user as User,
      cartId: +req.params.cartId,
      requestParams: req.query as unknown as paginationInput<CartProducts>
    });
    sendSuccessResponse<CartProducts[]>({
      res,
      currentPage: +(req.query?.page || 1),
      ...data
    });
  });

  updateProductInCart = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.cartService.updateProductInCart({
      user: req.user as User,
      body: req.body,
      productId: +req.params.productId
    });
    sendSuccessResponse<Cart>({
      res,
      data,
      message: "Cart Updated Successfully"
    });
  });
  deleteProductFromCart = asyncWrapper(async (req: Request, res: Response) => {
    await this.cartService.deleteProductFromCart({
      user: req.user as User,
      productId: +req.params.productId
    });
    sendSuccessResponse<CartProducts>({
      res,
      message: "Product Removed From Your Cart Successfully"
    });
  });

  emptyMyCart = asyncWrapper(async (req: Request, res: Response) => {
    await this.cartService.emptyMyCart({
      user: req.user as User
    });
    sendSuccessResponse<Cart>({
      res,
      message: "Cart Emptied Successfully"
    });
  });

  applyCoupon = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.cartService.applyCoupon({
      user: req.user as User,
      couponName: req.body.couponName
    });
    sendSuccessResponse<Cart & { price_after_discount: number }>({
      res,
      data,
      message: "Coupon Applied Successfully"
    });
  });
}
