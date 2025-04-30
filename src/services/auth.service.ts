import { z } from "zod";
import { UsersService } from "./users.service";
import jwt from "jsonwebtoken";
import { authSchema } from "../schemas/auth.schema";
import { User } from "../models/entities/user.entity";
import { NotAuthenticatedError } from "../utils/errors";
import bcrypt from "bcryptjs";

type registerBody = z.infer<typeof authSchema.register>;
type loginBody = z.infer<typeof authSchema.login>;

export class AuthService {
  private userService = new UsersService();
  async register(body: registerBody["body"]) {
    const user = await this.userService.createUser({
      ...body
    });

    const token = await this._generateToken(user);

    return {
      ...user,
      token
    };
  }

  async login(body: loginBody["body"]) {
    const user = await this.userService.getUserByEmail(body.email);

    const ispasswordValid = await bcrypt.compare(body.password, user.password);
    console.log({ user: user.password });
    console.log({ body: body.password });
    if (!ispasswordValid) {
      throw new NotAuthenticatedError("Password Is Incorrect");
    }
    const token = await this._generateToken(user);
    return {
      ...user,
      token
    };
  }

  private async _generateToken(user: User) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10)
      }
    );
  }
}
