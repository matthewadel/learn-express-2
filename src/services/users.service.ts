import { BadRequestError } from "../utils";
import { User, UserRoles } from "../models";
import { AppDataSource } from "../models/data-source";
import { findOneBy } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import bcrypt from "bcryptjs";

import { z } from "zod";
import { usersSchema } from "../schemas";
import { hashString } from "../utils";
import { authSchema } from "../schemas";

type CreateUserBody = z.infer<typeof usersSchema.createUser>;
type UpdateUserBody = z.infer<typeof usersSchema.updateUser>;
type updateUserPassword = z.infer<typeof authSchema.updateUserPassword>;

export class UsersService {
  private UsersRepository = AppDataSource.getRepository(User);

  async createUser(body: CreateUserBody["body"]): Promise<User> {
    const user = await this.UsersRepository.findOneBy({ email: body.email });
    if (user) throw new BadRequestError("This User Already Exists");

    const password = await hashString(body.password);
    const userEntity = this.UsersRepository.create({
      ...body,
      password,
      role: body.role as UserRoles // Ensure role is cast to UserRoles
    });

    return await this.UsersRepository.save(userEntity);
  }

  async getAllUsers(requestParams: paginationInput<User>) {
    return await getPaginatedResultsWithFilter<User>({
      entity: User,
      getImtesParams: requestParams,
      search_columns: ["email", "name"]
    });
  }

  async getUserById(id: number): Promise<User> {
    return await findOneBy<User>(User, { id });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await findOneBy<User>(User, { email });
  }

  async updateUser(
    id: number,
    body: UpdateUserBody["body"] & { password?: string }
  ): Promise<User> {
    const user = await findOneBy<User>(User, { id });

    // const password = body.password
    //   ? await hashString(body.password)
    //   : user.password;

    if (body.password)
      throw new BadRequestError("You can't update the password here");
    const updatedUser = this.UsersRepository.create({
      ...user,
      ...body,
      // password,
      role: body.role as UserRoles // Ensure role is cast to UserRoles
    });

    return await this.UsersRepository.save(updatedUser);
  }

  async updatePassword(userId: number, body: updateUserPassword["body"]) {
    const user = await findOneBy<User>(User, { id: userId });

    try {
      const result = await bcrypt.compare(body.currentPassword, user.password);
      if (!result) {
        throw new BadRequestError("Current password is incorrect");
      }
    } catch (err: unknown) {
      console.log(err);
      throw new BadRequestError((err as Error).message);
    }

    const hashedPassword = await hashString(body.newPassword);
    return await this.UsersRepository.save({
      ...user,
      password: hashedPassword,
      passwordChangedAt: new Date()
    });
  }

  async deleteUser(id: number): Promise<void> {
    const user = await findOneBy<User>(User, { id });

    await this.UsersRepository.remove(user);
  }
}
