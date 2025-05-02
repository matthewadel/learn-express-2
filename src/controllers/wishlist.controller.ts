import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { WishlistService } from "../services";
import { User } from "../models";
import { paginationInput } from "../utils";
import { sendSuccessResponse } from "../utils";
import { Product } from "../models";

export class WishlistController {
  private readonly wishlistService = new WishlistService();

  addToWishlist = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.wishlistService.addToWishlist({
      productId: +req.body.productId,
      user: req.user as User
    });
    sendSuccessResponse<User>({
      res,
      data,
      message: "Product Added Successfully To Your Wishlist"
    });
  });

  deleteFromWishlist = asyncWrapper(async (req: Request, res: Response) => {
    await this.wishlistService.deleteFromWishlist({
      productId: +req.params.productId,
      user: req.user as User
    });
    sendSuccessResponse<User>({
      res,
      message: "Product Removed Successfully From Wishlist"
    });
  });

  getWishlistOfUser = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.wishlistService.getWishlistOfUser({
      user: req.user as User,
      getImtesParams: req.query as unknown as paginationInput<Product>
    });
    sendSuccessResponse<Product>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });
}

// id
// detail
// city
// phone
// postal code
