import { z } from "zod";
import { UsersService } from "./users.service";
import jwt from "jsonwebtoken";
import { authSchema } from "../schemas/auth.schema";
import { User } from "../models/entities/user.entity";
import { NotAuthenticatedError } from "../utils/errors";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../models/data-source";

type registerBody = z.infer<typeof authSchema.register>;
type loginBody = z.infer<typeof authSchema.login>;
type forgetPasswordBody = z.infer<typeof authSchema.forgetPassword>;
type verifyResetCodeBody = z.infer<typeof authSchema.verifyResetCode>;
type resetPasswordBody = z.infer<typeof authSchema.resetPassword>;

export class AuthService {
  private userService = new UsersService();
  private UsersRepository = AppDataSource.getRepository(User);

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

  async forgetPassword(body: forgetPasswordBody["body"]) {
    const user = await this.userService.getUserByEmail(body.email);
    // generate 6 random digits
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await this.userService.hashPassword(resetCode);

    user.passwordResetCode = hashedCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await this.UsersRepository.save(user);
  }

  async verifyResetCode(body: verifyResetCodeBody["body"]) {}

  async resetPassword(body: resetPasswordBody["body"]) {}

  private async _generateToken(user: User) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as any
      }
    );
  }
}
