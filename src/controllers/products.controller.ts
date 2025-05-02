import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { Product, User } from "../models";
import { ProductsService } from "../services";
import { sendSuccessResponse } from "../utils";
import { paginationInput } from "../utils";

export class ProductsController {
  private readonly productsService: ProductsService = new ProductsService();

  createProduct = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.productsService.createProduct({
      user: req.user as User,
      body: req.body
    });
    sendSuccessResponse<Product>({
      res,
      data,
      statusCode: 201,
      message: "Product Created Successfully"
    });
  });

  getProductById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.productsService.getProductById(
      +req.params?.productId
    );
    sendSuccessResponse<Product>({
      res,
      data
    });
  });

  updateProduct = asyncWrapper(async (req: Request, res: Response) => {
    const productParams = req.body;
    const data = await this.productsService.updateProduct(
      +req.params.productId,
      productParams
    );
    sendSuccessResponse<Product>({
      res,
      data,
      message: "Product Updated Successfully"
    });
  });

  deleteProduct = asyncWrapper(async (req: Request, res: Response) => {
    await this.productsService.deleteProduct(+req.params.productId);
    sendSuccessResponse<Product>({
      res,
      message: "Product Deleted Successfully"
    });
  });

  getAllProducts = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.productsService.getAllProducts(
      req.query as unknown as paginationInput<Product>
    );
    sendSuccessResponse<Product>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });
}
