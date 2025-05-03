import { AppDataSource, DiscountType } from "../models";
import { Coupon } from "../models";
import { findOneBy } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { couponSchema } from "../schemas";
import { z } from "zod";
import { Cart } from "../models/entities/cart.entity";

type CreateCouponBody = z.infer<typeof couponSchema.createCoupon>;
type UpdateCouponBody = z.infer<typeof couponSchema.updateCoupon>;

export class CouponsService {
  private CouponsRepository = AppDataSource.getRepository(Coupon);

  async createCoupon(body: CreateCouponBody["body"]) {
    await this.getCouponByName(body.name);
    return await this.CouponsRepository.save({
      ...body,
      discount_type: body.discount_type as DiscountType
    });
  }

  async getAllCoupons(requestParams: paginationInput<Coupon>) {
    return await getPaginatedResultsWithFilter<Coupon>({
      entity: Coupon,
      getImtesParams: requestParams,
      search_columns: ["name"]
    });
  }

  async getCouponById(id: number): Promise<Coupon> {
    return await findOneBy<Coupon>(Coupon, { id });
  }

  async getCouponByName(name: string): Promise<Coupon> {
    return await findOneBy<Coupon>(Coupon, { name, checkExistence: true });
  }

  async getCouponByNamewithourCheckExistence(name: string): Promise<Coupon> {
    return await findOneBy<Coupon>(Coupon, { name });
  }

  calculateCouponDiscount({ coupon, cart }: { coupon?: Coupon; cart: Cart }) {
    if (coupon)
      return coupon.discount_type === DiscountType.DEDUCTION
        ? coupon.discount
        : (cart?.totalPrice as number) * (coupon.discount / 100);
    else return 0;
  }

  async updateCoupon(
    id: number,
    body: UpdateCouponBody["body"]
  ): Promise<Coupon> {
    const coupon = await this.getCouponById(id);

    return this.CouponsRepository.save({
      ...coupon,
      ...body,
      discount_type:
        (body.discount_type as DiscountType) ?? coupon.discount_type
    });
  }

  async deleteCoupon(id: number): Promise<void> {
    const coupon = await this.getCouponById(id);

    await this.CouponsRepository.remove(coupon);
  }
}
