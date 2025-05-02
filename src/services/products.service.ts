import { AppDataSource, User } from "../models";
import { Product } from "../models";
import { findOneBy } from "../utils";
import { ImagesService } from "./images.service";
import { z } from "zod";
import { productsSchema } from "../schemas";
import { BadRequestError } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { BrandsService } from "./brands.service";
import { CategoryService } from "./categories.service";
import { ColorsService } from "./colors.service";
import { SubCategoriesService } from "./subCategories.service";

// Extract the type of body from productsSchema.createProduct
type CreateProductBody = z.infer<typeof productsSchema.createProduct>;
type UpdateProductBody = z.infer<typeof productsSchema.updateProduct>;

export class ProductsService {
  private productsRepository = AppDataSource.getRepository(Product);
  private imagesService = new ImagesService();
  private brandService = new BrandsService();
  private categoryService = new CategoryService();
  private colorService = new ColorsService();
  private subCategoriesService = new SubCategoriesService();

  async createProduct({
    user,
    body
  }: {
    user: User;
    body: CreateProductBody["body"];
  }): Promise<Product> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newProduct: any = { ...body };
    newProduct.brand = await this._getBrand(body.brand);

    newProduct.category = await this._getCategory(body.category);

    newProduct.user = user;

    if (body.image_cover) newProduct.image_cover = body.image_cover[0];
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
        relations: [
          "brand",
          "category",
          "subCategories",
          "colors",
          "images",
          "reviews"
        ]
      }
    });
    return product;
  }

  async getAllProducts(requestParamsrequestParams: paginationInput<Product>) {
    return await getPaginatedResultsWithFilter<Product>({
      entity: Product,
      getImtesParams: requestParamsrequestParams,
      search_columns: ["title", "description"],
      inputOptions: {
        relations: [
          "brand",
          "category",
          "subCategories",
          "colors",
          "images",
          "reviews"
        ]
      }
    });
  }

  async updateProduct(id: number, body: UpdateProductBody["body"]) {
    const product = await this.getProductById(id);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(body as any)
    });
    return product;
  }

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);

    await this.productsRepository.remove(product);
  }

  private async _getBrand(id: number) {
    return this.brandService.getBrandById(id);
  }

  private async _getCategory(id: number) {
    return this.categoryService.getCategoryById(id);
  }

  private async _getColors(colors: number[]) {
    return await Promise.all(
      colors.map(async (color: number) => {
        return this.colorService.getColorById(color);
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
        const subCat =
          await this.subCategoriesService.getSubCategoryById(subCategory);

        if (subCat.parent_category.id !== parentCategoryId)
          throw new BadRequestError(
            "SubCategory does not belong to parent category"
          );
        return subCat;
      })
    );
  }
}
