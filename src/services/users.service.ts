import { AppDataSource } from "../models/data-source";
import { BadRequestError } from "../utils/errors";
import { User, UserRoles } from "../models/entities/user.entity";
import { findOneBy } from "../utils/findOneBy";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";
import bcrypt from "bcryptjs";

import { z } from "zod";
import { usersSchema } from "../schemas/users.schema";

type CreateUserBody = z.infer<typeof usersSchema.createUser>;
type UpdateUserBody = z.infer<typeof usersSchema.updateUser>;
type updateUserPassword = z.infer<typeof usersSchema.updateUserPassword>;

export class UsersService {
  private UsersRepository = AppDataSource.getRepository(User);

  async createUser(body: CreateUserBody["body"]): Promise<User> {
    const user = await this.UsersRepository.findOneBy({ email: body.email });
    if (user) throw new BadRequestError("This User Already Exists");

    const password = await this._hashPassword(body.password);
    const userEntity = this.UsersRepository.create({
      ...body,
      password,
      role: body.role as UserRoles // Ensure role is cast to UserRoles
    });

    return await this.UsersRepository.save(userEntity);
  }

  async getAllUsers(requestParams: paginationInput<User>) {
    return await getPaginatedResultsWithFilter<User>(User, requestParams, [
      "email",
      "name"
    ]);
  }

  async getUserById(id: number): Promise<User> {
    return await findOneBy<User>(User, { id });
  }

  async updateUser(id: number, body: UpdateUserBody["body"]): Promise<User> {
    const user = await findOneBy<User>(User, { id });

    const password = body.password
      ? await this._hashPassword(body.password)
      : user.password;
    const updatedUser = this.UsersRepository.create({
      ...user,
      ...body,
      password,
      role: body.role as UserRoles // Ensure role is cast to UserRoles
    });

    return await this.UsersRepository.save(updatedUser);
  }

  async updatePassword(userId: number, body: updateUserPassword["body"]) {
    const user = await findOneBy<User>(User, { id: userId });
    console.log("password", user.password);

    try {
      const result = await bcrypt.compare(body.currentPassword, user.password);
      if (!result) {
        throw new BadRequestError("Current password is incorrect");
      }
    } catch (err: unknown) {
      console.log(err);
      throw new BadRequestError((err as Error).message);
    }

    const hashedPassword = await this._hashPassword(body.newPassword);
    return await this.UsersRepository.save({
      ...user,
      password: hashedPassword
    });
  }

  async deleteUser(id: number): Promise<void> {
    const user = await findOneBy<User>(User, { id });

    await this.UsersRepository.remove(user);
  }

  private _hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
