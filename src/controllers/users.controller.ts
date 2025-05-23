import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { sendSuccessResponse } from "../utils";
import { UsersService } from "../services";
import { User } from "../models";
import { paginationInput } from "../utils";

export class UsersController {
  private readonly usersService: UsersService = new UsersService();

  createUser = asyncWrapper(async (req: Request, res: Response) => {
    const user = await this.usersService.createUser(req.body);
    sendSuccessResponse<User>({
      res,
      data: user,
      statusCode: 201,
      message: "User Created Successfully"
    });
  });

  getAllUsers = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.usersService.getAllUsers(
      req.query as unknown as paginationInput<User>
    );
    sendSuccessResponse<User>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getUserById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.usersService.getUserById(+req.params.userId);
    sendSuccessResponse<User>({
      res,
      data
    });
  });

  updateUser = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.usersService.updateUser(
      +req.params.userId,
      req.body
    );
    sendSuccessResponse<User>({
      res,
      data,
      statusCode: 201,
      message: "User Updated Successfully"
    });
  });

  deleteUser = asyncWrapper(async (req: Request, res: Response) => {
    await this.usersService.deleteUser(+req.params.userId);
    sendSuccessResponse<User>({
      res,
      message: "User Deleted Successfully"
    });
  });

  changeUserRole = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.usersService.changeUserRole({
      userId: +req.params.userId,
      body: req.body
    });
    sendSuccessResponse<User>({
      res,
      data,
      message: "User Updated Successfully"
    });
  });
}
