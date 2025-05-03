import { z } from "zod";
import { PaymentMethodTypes } from "../models/entities/order.entity";

const createOrder = z.object({
  body: z.object({
    cartId: z.number({ required_error: "Cart ID is required" }),
    paymentMethod: z
      .enum(Object.values(PaymentMethodTypes) as [string, ...string[]])
      .optional(),
    copoun: z.string().optional(),
    address_id: z.number()
  })
});

export const orderSchema = {
  createOrder
};
