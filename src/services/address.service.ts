import { Repository } from "typeorm";
import { AddressAlias, AppDataSource, City, User } from "../models";
import { Address } from "../models";
import {
  paginationInput,
  getPaginatedResultsWithFilter,
  NotFoundError,
  NotAuthorizedError,
  findOneBy
} from "../utils";
import { addressSchema } from "../schemas/address.schema";
import { z } from "zod";

type CreateAddressBody = z.infer<typeof addressSchema.createAddress>;

export class AddressService {
  private readonly addressRepository: Repository<Address> =
    AppDataSource.getRepository(Address);
  private readonly cityRepository: Repository<City> =
    AppDataSource.getRepository(City);

  async createAddress({
    user,
    address
  }: {
    user: User;
    address: CreateAddressBody["body"];
  }) {
    const city = await this.cityRepository.findOne({
      where: { id: address.cityId }
    });
    if (!city) throw new NotFoundError("City not found");

    const newAddress = this.addressRepository.create({
      ...address,
      city,
      user,
      alias: address.alias as AddressAlias
    });
    return await this.addressRepository.save(newAddress);
  }

  async getAllAddresses(query: paginationInput<Address>) {
    return await getPaginatedResultsWithFilter<Address>({
      entity: Address,
      getImtesParams: query,
      search_columns: ["details", "alias"]
    });
  }

  async getAddressById(id: number) {
    return await findOneBy<Address>(Address, {
      id,
      options: { relations: ["user"] }
    });
  }

  async getMyAddresses({
    user,
    query
  }: {
    user: User;
    query: paginationInput<Address>;
  }) {
    return await getPaginatedResultsWithFilter<Address>({
      entity: Address,
      getImtesParams: query,
      search_columns: ["details", "alias"],
      inputOptions: { where: { user: { id: user.id } } }
    });
  }

  async updateAddress({
    id,
    data,
    user
  }: {
    id: number;
    data: Partial<Address>;
    user: User;
  }): Promise<Address | null> {
    const address = await this.getAddressById(id);

    Object.assign(address, data);

    this._handleAuthorization(user, address);
    return await this.addressRepository.save(address);
  }

  async deleteAddress({ id, user }: { id: number; user: User }): Promise<void> {
    const address = await this.getAddressById(id);
    this._handleAuthorization(user, address);
    await this.addressRepository.delete(id);
  }

  private _handleAuthorization(user: User, address: Address) {
    if (user.role !== "admin" && address.user.id !== user.id)
      throw new NotAuthorizedError(
        "You are not authorized to perform this action"
      );
  }
}
