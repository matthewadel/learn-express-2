import { AppDataSource } from "../models";
import { User } from "../models";
import { BadRequestError } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { Product } from "../models";
import { ProductsService } from "./products.service";

export class WishlistService {
  private UserRepository = AppDataSource.getRepository(User);
  private productService = new ProductsService();

  async addToWishlist({ productId, user }: { productId: number; user: User }) {
    const userWithWishlist = await this.UserRepository.findOne({
      where: { id: user.id },
      relations: ["wishlist_products"]
    });

    if (
      userWithWishlist?.wishlist_products.some(
        (product) => product.id === productId
      )
    ) {
      throw new BadRequestError("Product already in wishlist");
    }

    const product = await this.productService.getProductById(productId);
    user.wishlist_products = [
      ...(userWithWishlist?.wishlist_products || []),
      product
    ];
    return this.UserRepository.save(user);
  }

  async deleteFromWishlist({
    productId,
    user
  }: {
    productId: number;
    user: User;
  }) {
    const userWithWishlist = await this.UserRepository.findOne({
      where: { id: user.id },
      relations: ["wishlist_products"]
    });

    if (
      !userWithWishlist?.wishlist_products.some(
        (product) => product.id === productId
      )
    ) {
      throw new BadRequestError("Product not in wishlist");
    }

    // Remove the product from the wishlist
    userWithWishlist.wishlist_products =
      userWithWishlist.wishlist_products.filter(
        (product) => product.id !== productId
      );

    // Save the updated user entity
    await this.UserRepository.save(userWithWishlist);
  }

  async getWishlistOfUser({
    user,
    getImtesParams
  }: {
    user: User;
    getImtesParams: paginationInput<Product>;
  }) {
    return await getPaginatedResultsWithFilter<Product>({
      entity: Product,
      inputOptions: {
        where: { favoritedBy: { id: user.id } }
      },
      getImtesParams
    });
  }
}
