import { z } from "zod";

const addToWishlist = z.object({
  body: z
    .object({
      productId: z.number({ required_error: "Name is required" })
    })
    .strict()
});

export const wishlistSchema = { addToWishlist };
