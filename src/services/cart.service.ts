import { CouponsService } from "./coupon.service";
import { BadRequestError, NotFoundError } from "./../utils/errors";
import { CartProducts } from "./../models/entities/cartProducts.entity";
import { ProductsService } from "./products.service";
import { AppDataSource, DiscountType, User } from "../models";
import { Cart } from "../models/entities/cart.entity";
import { cartSchema } from "../schemas";
import { z } from "zod";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { ColorsService } from "./colors.service";

type addToCartBody = z.infer<typeof cartSchema.addToCart>;
type updateCarttBody = z.infer<typeof cartSchema.updateCart>;

export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartProductRepository = AppDataSource.getRepository(CartProducts);
  private productsService = new ProductsService();
  private colorsService = new ColorsService();
  private couponsService = new CouponsService();

  async addToCart({ user, body }: { user: User; body: addToCartBody["body"] }) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ["cartProducts", "cartProducts.color", "cartProducts.product"]
    });

    if (!cart)
      cart = await this.cartRepository.save({
        user
      });

    let newCartProduct;

    const cartProductIndex = cart.cartProducts?.findIndex(
      (cartProduct) =>
        cartProduct.product.id === body.productId &&
        cartProduct.color.id === body.colorId
    );

    if (cartProductIndex && cartProductIndex !== -1) {
      const cartProduct = cart.cartProducts[cartProductIndex];
      const quantity = cartProduct.quantity + (body.quantity || 1);
      newCartProduct = await this.cartProductRepository.save({
        ...cartProduct,
        quantity,
        price:
          (cartProduct.product.price_after_discount ||
            cartProduct.product.price) * quantity
      });

      cart.cartProducts[cartProductIndex] = newCartProduct;
    } else {
      const product = await this.productsService.getProductById(body.productId);
      const color = await this.colorsService.getColorById(body.colorId);

      newCartProduct = await this.cartProductRepository.save({
        product,
        quantity: body.quantity || 1,
        color,
        price: product.price * (body.quantity || 1)
      });

      cart.cartProducts.push(newCartProduct);
    }

    const totalPrice = cart.cartProducts.reduce((total, item) => {
      total += item.price;
      return total;
    }, 0);

    await this.cartRepository.save({
      ...cart,
      totalPrice
    });

    return newCartProduct;
  }

  async getMyCart({ user }: { user: User }) {
    return await this.cartRepository.find({
      where: { user: { id: user.id } },
      relations: ["cartProducts", "cartProducts.product", "cartProducts.color"]
    });
  }

  async getCartProducts({
    cartId,
    user,
    requestParams
  }: {
    requestParams: paginationInput<CartProducts>;
    user: User;
    cartId: number;
  }) {
    if (!cartId) cartId = (await this.getMyCart({ user }))[0]?.id || 0;

    return await getPaginatedResultsWithFilter<CartProducts>({
      entity: CartProducts,
      getImtesParams: requestParams,
      inputOptions: {
        where: { cart: { id: cartId } },
        relations: ["product", "color"]
      }
    });
  }

  async updateProductInCart({
    user,
    body,
    productId
  }: {
    user: User;
    body: updateCarttBody["body"];
    productId: number;
  }) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ["cartProducts", "cartProducts.color", "cartProducts.product"]
    });
    let totalPrice = cart?.totalPrice;

    if (cart) {
      const cartProduct = cart.cartProducts.find(
        (cartProcuct) => cartProcuct.id === productId
      );

      if (cartProduct) {
        if (body.colorId) {
          const color = await this.colorsService.getColorById(body.colorId);
          cartProduct.color = color;
        }

        if (body.quantity) {
          totalPrice =
            cart.totalPrice -
            cartProduct.price +
            (body.quantity || 1) *
              (cartProduct.product.price_after_discount ||
                cartProduct.product.price);

          cartProduct.quantity = body.quantity;
          cartProduct.price =
            body.quantity *
            (cartProduct.product.price_after_discount ||
              cartProduct.product.price);
        }

        return this.cartRepository.save({
          ...cart,
          totalPrice
        });
      }
    }
  }

  async deleteProductFromCart({
    user,
    productId
  }: {
    user: User;
    productId: number;
  }) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ["cartProducts", "cartProducts.color", "cartProducts.product"]
    });

    if (cart) {
      const cartProductIndex = cart.cartProducts.findIndex(
        (cartProduct) => cartProduct.id === productId
      );

      if (cartProductIndex !== -1) {
        const totalPrice =
          cart.totalPrice - cart.cartProducts[cartProductIndex].price;
        cart.cartProducts.splice(cartProductIndex, 1);

        await this.cartRepository.save({
          ...cart,
          totalPrice
        });

        await this.cartProductRepository.delete({ id: productId });
      } else throw new NotFoundError("Product not found");
    }
  }

  async emptyMyCart({ user }: { user: User }) {
    await this.cartRepository.delete({ user: { id: user.id } });
    // await this.cartProductRepository.delete({ cart: { id: cartId } });
  }

  async applyCoupon({ user, couponName }: { user: User; couponName: string }) {
    const coupon =
      await this.couponsService.getCouponByNamewithourCheckExistence(
        couponName
      );

    if (!coupon) throw new NotFoundError("Coupon not found");
    if (coupon.expire < new Date())
      throw new BadRequestError("Coupon is expired");

    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ["cartProducts", "cartProducts.color", "cartProducts.product"]
    });
    if (cart) {
      const discountValue =
        coupon.discount_type === DiscountType.DEDUCTION
          ? coupon.discount
          : (cart?.totalPrice as number) * (coupon.discount / 100);
      return {
        ...cart,
        price_after_discount: (cart?.totalPrice as number) - discountValue
      };
    } else throw new NotFoundError("Cart not found");
  }
}
