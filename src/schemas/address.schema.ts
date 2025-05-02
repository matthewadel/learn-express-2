import { z } from "zod";
import { AddressAlias } from "../models";

const createAddress = z.object({
  body: z.object({
    details: z
      .string({ required_error: "Details are required" })
      .min(3, { message: "Details must be at least 3 characters long" }),
    phone: z
      .string({ required_error: "Phone is required" })
      .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
    cityId: z.number({ required_error: "City is required" }),
    postalCode: z.number().optional(),
    alias: z.enum(Object.values(AddressAlias) as [string, ...string[]])
  })
});

const updateAddress = z.object({
  body: createAddress.shape.body.deepPartial()
});

export const addressSchema = {
  createAddress,
  updateAddress
};
