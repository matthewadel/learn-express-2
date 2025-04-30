import { z } from "zod";
import { UsersService } from "./users.service";
import { usersSchema } from "../schemas/users.schema";

type CreateUserBody = z.infer<typeof usersSchema.createUser>;

export class AuthService {
  private userService = new UsersService();
  async signup(body: CreateUserBody["body"]) {
    this.userService.createUser({
      ...body
    });
  }
}
