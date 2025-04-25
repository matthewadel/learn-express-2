import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { Product } from "../models/entities/product.entity";
import { ProductsService } from "../services/products.service";
import { SendSuccessResponse } from "../utils/sendSuccessResponse";
import { paginationInput } from "../utils/getPaginatedResultsWithFilter";

export class ProductsController {
  private readonly productsService: ProductsService = new ProductsService();

  createProduct = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.productsService.createProduct(req.body);
    SendSuccessResponse<Product>({
      res,
      data,
      message: "Product Created Successfully"
    });
  });

  getProductById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.productsService.getProductById(
      +req.params?.productId
    );
    SendSuccessResponse<Product>({
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
    SendSuccessResponse<Product>({
      res,
      data,
      message: "Product Updated Successfully"
    });
  });

  deleteProduct = asyncWrapper(async (req: Request, res: Response) => {
    await this.productsService.deleteProduct(+req.params.productId);
    SendSuccessResponse<Product>({
      res,
      message: "Product Deleted Successfully"
    });
  });

  getAllProducts = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.productsService.getAllProducts(
      req.query as unknown as paginationInput<Product>
    );
    SendSuccessResponse<Product>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });
}
