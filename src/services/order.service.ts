import { z } from "zod";
import { orderSchema } from "../schemas/order.schema";
import { AppDataSource, User } from "../models";
import { CartService } from "./cart.service";
import { CouponsService } from "./coupon.service";
import {
  checkAuthorization,
  findOneBy,
  getPaginatedResultsWithFilter,
  NotFoundError,
  paginationInput
} from "../utils";
import { Order, PaymentMethodTypes } from "../models/entities/order.entity";
import { ProductsService } from "./products.service";
import { AddressService } from "./address.service";

type CreateOrderBody = z.infer<typeof orderSchema.createOrder>;

export class OrderService {
  private cartService = new CartService();
  private couponsService = new CouponsService();
  private productsService = new ProductsService();
  private addressService = new AddressService();
  private orderRepository = AppDataSource.getRepository(Order);

  async createOrder({
    user,
    body
  }: {
    user: User;
    body: CreateOrderBody["body"];
  }) {
    let coupon;
    // 1) get card with cartId
    const cart = (await this.cartService.getMyCart({ user }))[0];
    if (!cart) throw new NotFoundError("Cart not found");

    // 2) check if coupon is applied
    if (body.copoun)
      coupon = await this.couponsService.getCouponByNamewithourCheckExistence(
        body.copoun
      );

    // 3) check quantity ot all products in cart
    cart.cartProducts.map(async (cartProduct) => {
      if (!cartProduct.product.quantity)
        throw new NotFoundError(`${cartProduct.product.title} is out of stock`);
    });

    // 4) calculate price after tax, shipping and coupon
    const discountValue = this.couponsService.calculateCouponDiscount({
      coupon,
      cart
    });
    const total_price = cart.totalPrice - discountValue;

    // 5) get address
    const address = await this.addressService.getAddressById(body.address_id);
    console.log(address);
    // 6) create order
    const order = await this.orderRepository.save({
      user,
      cartProducts: cart.cartProducts,
      address,
      paymentMethod:
        (body.paymentMethod as PaymentMethodTypes) ?? PaymentMethodTypes.CASH,
      total_price
    });
    // 7) decrease order quantity and increate order sold
    await Promise.all(
      cart.cartProducts.map(async (cartProduct) => {
        await this.productsService.updateProduct(cartProduct.product.id, {
          quantity: cartProduct.product.quantity - 1,
          number_of_times_sold: cartProduct.product.number_of_times_sold + 1
        });
      })
    );

    // 8) clear cart
    await this.cartService.emptyMyCart({ user });

    return order;
  }

  async getOrders({
    requestParams
  }: {
    requestParams: paginationInput<Order>;
  }) {
    return await getPaginatedResultsWithFilter<Order>({
      entity: Order,
      getImtesParams: requestParams
    });
  }

  async getMyOrders({
    user,
    requestParams
  }: {
    user: User;
    requestParams: paginationInput<Order>;
  }) {
    return await getPaginatedResultsWithFilter<Order>({
      entity: Order,
      getImtesParams: requestParams,
      inputOptions: { where: { user: { id: user.id } } }
    });
  }

  async getOrderById(orderId: number, user: User) {
    const order = await findOneBy<Order>(Order, {
      id: orderId,
      options: { relations: ["user", "address", "cartProducts"] }
    });
    checkAuthorization(user, order);
    return order;
  }
}
