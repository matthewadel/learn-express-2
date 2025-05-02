import { AppDataSource } from "../models/data-source";
import { User } from "../models/entities/user.entity";
import { BadRequestError } from "../utils/errors";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";
import { findOneBy } from "../utils/findOneBy";
import { Product } from "../models/entities/product.entity";

export class WishlistService {
  private UserRepository = AppDataSource.getRepository(User);

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

    const product = await findOneBy<Product>(Product, {
      id: productId
    });
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
    getImtesParams: paginationInput<User>;
  }) {
    return await getPaginatedResultsWithFilter<User>({
      entity: User,
      inputOptions: {
        relations: ["wishlist_products"],
        where: { id: user.id }
      },
      getImtesParams
    });
  }
}
