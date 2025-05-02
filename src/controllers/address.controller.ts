import { Request, Response } from "express";
import { asyncWrapper } from "../middlewares";
import { sendSuccessResponse } from "../utils";
import { AddressService } from "../services";
import { Address } from "../models";
import { paginationInput } from "../utils";
import { User } from "../models";

export class AddressController {
  private readonly addressService: AddressService = new AddressService();

  createAddress = asyncWrapper(async (req: Request, res: Response) => {
    const address = await this.addressService.createAddress({
      user: req.user as User,
      address: req.body
    });
    sendSuccessResponse<Address>({
      res,
      data: address,
      statusCode: 201,
      message: "Address Created Successfully"
    });
  });

  getAllAddresses = asyncWrapper(async (req: Request, res: Response) => {
    const response = await this.addressService.getAllAddresses(
      req.query as unknown as paginationInput<Address>
    );
    sendSuccessResponse<Address>({
      res,
      currentPage: +(req.query?.page || 1),
      ...response
    });
  });

  getAddressById = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.addressService.getAddressById(
      +req.params.addressId
    );
    sendSuccessResponse<Address>({
      res,
      data
    });
  });

  updateAddress = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.addressService.updateAddress({
      id: +req.params.addressId,
      data: req.body,
      user: req.user as User
    });
    sendSuccessResponse<Address>({
      res,
      data,
      message: "Address Updated Successfully"
    });
  });

  deleteAddress = asyncWrapper(async (req: Request, res: Response) => {
    await this.addressService.deleteAddress({
      id: +req.params.addressId,
      user: req.user as User
    });
    sendSuccessResponse<Address>({
      res,
      message: "Address Deleted Successfully"
    });
  });

  getMyAddresses = asyncWrapper(async (req: Request, res: Response) => {
    const data = await this.addressService.getMyAddresses({
      user: req.user as User,
      query: req.query as unknown as paginationInput<Address>
    });
    sendSuccessResponse<Address>({
      res,
      currentPage: +(req.query?.page || 1),
      ...data
    });
  });
}
