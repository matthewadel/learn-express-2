import { z } from "zod";
import { usersSchema } from "./users.schema";

const register = z.object({
  body: usersSchema.createUser.shape.body.innerType()
});

const login = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
  })
});

export const authSchema = {
  register,
  login
};
