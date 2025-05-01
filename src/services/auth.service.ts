import { z } from "zod";
import { UsersService } from "./users.service";
import jwt from "jsonwebtoken";
import { authSchema } from "../schemas/auth.schema";
import { User } from "../models/entities/user.entity";
import { NotAuthenticatedError, ServerError } from "../utils/errors";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../models/data-source";
import { getEnv } from "../utils/validateEnv";
import { hashString } from "../utils/hashString";
import { EmailService } from "./email.service";

type registerBody = z.infer<typeof authSchema.register>;
type loginBody = z.infer<typeof authSchema.login>;
type forgetPasswordBody = z.infer<typeof authSchema.forgetPassword>;
type verifyEmailParams = z.infer<typeof authSchema.verifyEmail>;
type resetPasswordBody = z.infer<typeof authSchema.resetPassword>;

export class AuthService {
  private userService = new UsersService();
  private UsersRepository = AppDataSource.getRepository(User);
  private emailService = new EmailService();

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
    const hashedCode = await hashString(resetCode);

    user.passwordResetCode = hashedCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await this.UsersRepository.save(user);

    try {
      const verificationUrl = await this.emailService.sendVerificationEmail({
        email: body.email,
        token: hashedCode,
        subject: "Verify Your Email"
      });
      return { verificationUrl };
    } catch (e) {
      console.log(e);
      user.passwordResetCode = "";
      user.passwordResetExpires = null;
      user.resetPasswordVerified = false;
      await this.UsersRepository.save(user);
      throw new ServerError((e as Error).message, e);
    }
  }

  async verifyEmail(query: verifyEmailParams["query"]) {
    console.log(query.email);
    const user = await this.userService.getUserByEmail(query.email);
    if (
      user.passwordResetCode === query.token &&
      (user.passwordResetExpires as Date) > new Date()
    ) {
      user.passwordResetCode = "";
      user.passwordResetExpires = null;
      user.resetPasswordVerified = true;
      await this.UsersRepository.save(user);
    } else throw new NotAuthenticatedError("Code Is Incorrect");
  }

  async resetPassword(body: resetPasswordBody["body"]) {
    console.log({ body });
    const user = await this.userService.getUserByEmail(body.email);
    if (!user.resetPasswordVerified)
      throw new NotAuthenticatedError("Code Is Not Verified");

    user.password = await hashString(body.newPassword);
    user.passwordChangedAt = new Date();
    user.resetPasswordVerified = false;
    await this.UsersRepository.save(user);
    return await this.login({
      email: body.email,
      password: body.newPassword
    });
  }

  private async _generateToken(user: User) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      getEnv().JWT_SECRET as string,
      {
        expiresIn: getEnv().JWT_EXPIRES_IN
      }
    );
  }
}
