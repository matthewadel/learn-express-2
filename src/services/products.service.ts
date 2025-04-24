import { AppDataSource } from "../models/data-source";
import { Brand } from "../models/entities/brand.entity";
import { Category } from "../models/entities/category.entity";
import { Color } from "../models/entities/color.entity";
import { Product } from "../models/entities/product.entity";
import { SubCategory } from "../models/entities/subCategory.entity";
import { findOneBy } from "../utils/findOneBy";
import { ImagesService } from "./images.service";
import { z } from "zod";
import { productsSchema } from "../schemas/products.schema";
import { BadRequestError } from "../utils/errors";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";

// Extract the type of body from productsSchema.createProduct
type CreateProductBody = z.infer<typeof productsSchema.createProduct>;
type UpdateProductBody = z.infer<typeof productsSchema.updateProduct>;

export class ProductsService {
  private productsRepository = AppDataSource.getRepository(Product);
  private imagesService = new ImagesService();

  async createProduct(body: CreateProductBody["body"]): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newProduct: any = { ...body };

    newProduct.brand = await this._getBrand(body.brand);

    newProduct.category = await this._getCategory(body.category);

    if (body.images) newProduct.images = await this._getImages(body.images);

    if (body.colors) newProduct.colors = await this._getColors(body.colors);

    if (body.subCategories)
      newProduct.subCategories = await this._getSubCategories(
        body.subCategories,
        body.category
      );

    return this.productsRepository.save(newProduct);
  }

  async getProductById(id?: number) {
    const product = await findOneBy<Product>(Product, {
      id: id,
      options: {
        relations: ["brand", "category", "subCategories", "colors", "images"]
      }
    });
    return product;
  }

  async getAllProducts(requestParamsrequestParams: paginationInput<Product>) {
    return await getPaginatedResultsWithFilter<Product>(
      Product,
      requestParamsrequestParams,
      ["title", "description"],
      {
        relations: ["brand", "category", "subCategories", "colors", "images"]
      }
    );
  }

  async updateProduct(id: number, body: UpdateProductBody["body"]) {
    const product = await findOneBy<Product>(Product, {
      id: id,
      options: {
        relations: ["brand", "category", "subCategories", "colors", "images"]
      }
    });

    // if (body.title) product.title = body.title;
    // if (body.description) product.description = body.description;
    // if (body.quantity) product.quantity = body.quantity;
    // if (body.number_of_times_sold)
    //   product.number_of_times_sold = body.number_of_times_sold;
    // if (body.price) product.price = body.price;
    // if (body.price_after_discount)
    //   product.price_after_discount = body.price_after_discount;
    // if (body.ratings_average) product.ratings_average = body.ratings_average;
    // if (body.number_of_reviewers)
    //   product.number_of_reviewers = body.number_of_reviewers;
    // if (body.image_cover) product.image_cover = body.image_cover;

    if (body.brand) {
      product.brand = await this._getBrand(body.brand);
      delete body.brand;
    }
    if (body.category) {
      product.category = await this._getCategory(body.category);
      delete body.category;
    }

    if (body.colors) {
      product.colors = await this._getColors(body.colors);
      delete body.colors;
    }

    if (body.subCategories) {
      product.subCategories = await this._getSubCategories(
        body.subCategories,
        product.category.id
      );
      delete body.subCategories;
    }

    if (body.images) {
      product.images = [
        ...(product.images || []),
        ...(await this._getImages(body.images))
      ];
      delete body.images;
    }
    if (body.deletedImagesIds) {
      for (id of body.deletedImagesIds) {
        product.images = (product.images || []).filter(
          (image) => image.id !== id
        );
        await this.imagesService.deleteImage(id);
      }
      delete body.deletedImagesIds;
    }

    await this.productsRepository.save({
      ...product,
      ...(body as any)
    });
    return product;
  }

  async deleteProduct(id: number) {
    const product = await findOneBy<Product>(Product, {
      id
    });

    await this.productsRepository.remove(product);
  }

  private async _getBrand(id: number) {
    return await findOneBy<Brand>(Brand, {
      id
    });
  }

  private async _getCategory(id: number) {
    return await findOneBy<Category>(Category, {
      id
    });
  }

  private async _getColors(colors: number[]) {
    return await Promise.all(
      colors.map(async (color: number) => {
        return await findOneBy<Color>(Color, {
          id: color
        });
      })
    );
  }

  private async _getImages(images: string[]) {
    return await Promise.all(
      images.map(
        async (image: string) => await this.imagesService.createImage(image)
      )
    );
  }

  private async _getSubCategories(
    subCategories: number[],
    parentCategoryId: number
  ) {
    return await Promise.all(
      subCategories.map(async (subCategory: number) => {
        const subCat = await findOneBy<SubCategory>(SubCategory, {
          id: subCategory,
          options: { relations: ["parent_category"] }
        });

        if (subCat.parent_category.id !== parentCategoryId)
          throw new BadRequestError(
            "SubCategory does not belong to parent category"
          );
        return subCat;
      })
    );
  }
}
