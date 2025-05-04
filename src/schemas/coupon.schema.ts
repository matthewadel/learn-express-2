import { z } from "zod";
import { getALlItemsValidationWithPagination } from "../utils";

const createCoupon = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(32, { message: "Name must be at most 32 characters long" }),
      expire: z
        .string({ required_error: "Expire date is required" })
        .refine((date) => !isNaN(Date.parse(date)), {
          message: "Expire must be a valid date"
        }),
      discount: z
        .number({ required_error: "Discount is required" })
        .positive({ message: "Discount must be a positive number" }),
      discount_type: z.enum(["percentage", "deduction"], {
        required_error: "Discount type is required"
      })
    })
    .strict()
});

const updateCoupon = z.object({
  body: createCoupon.shape.body.deepPartial().strict()
});

const getAllCoupons = getALlItemsValidationWithPagination(
  createCoupon.shape.body.shape
);

export const couponSchema = {
  createCoupon,
  updateCoupon,
  getAllCoupons
};
