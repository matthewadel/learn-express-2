export const CartSchema = {};
import { z } from "zod";

const addToCart = z
  .object({
    body: z.object({
      productId: z.number({ required_error: "Product ID is required" }),
      quantity: z.number({ required_error: "Quantity is required" }).optional(),
      colorId: z.number({ required_error: "Color is required" })
    })
  })
  .strict();

const updateCart = z
  .object({
    body: z.object({
      quantity: z.number({ required_error: "Quantity is required" }).optional(),
      colorId: z.number({ required_error: "Color is required" }).optional()
    })
  })
  .strict();

export const cartSchema = {
  addToCart,
  updateCart
};
