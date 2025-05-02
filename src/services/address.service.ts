import { Repository } from "typeorm";
import { AddressAlias, AppDataSource, User } from "../models";
import { Address } from "../models";
import {
  paginationInput,
  getPaginatedResultsWithFilter,
  NotFoundError,
  findOneBy,
  checkAuthorization
} from "../utils";
import { addressSchema } from "../schemas/address.schema";
import { z } from "zod";
import { CityService } from "./city.service";

type CreateAddressBody = z.infer<typeof addressSchema.createAddress>;
type updateAddressBody = z.infer<typeof addressSchema.updateAddress>;

export class AddressService {
  private readonly addressRepository: Repository<Address> =
    AppDataSource.getRepository(Address);
  private readonly cityService = new CityService();

  async createAddress({
    user,
    address
  }: {
    user: User;
    address: CreateAddressBody["body"];
  }) {
    const city = await this.cityService.getCityById(address.cityId);
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
      search_columns: ["details", "alias"],
      inputOptions: { relations: ["city"] }
    });
  }

  async getAddressById(id: number) {
    return await findOneBy<Address>(Address, {
      id,
      options: { relations: ["user", "city"] }
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
      inputOptions: { where: { user: { id: user.id } }, relations: ["city"] }
    });
  }

  async updateAddress({
    id,
    data,
    user
  }: {
    id: number;
    data: updateAddressBody["body"];
    user: User;
  }) {
    const address = await this.getAddressById(id);

    checkAuthorization(user, address);
    return await this.addressRepository.save({
      ...address,
      ...data,
      alias: (data.alias as AddressAlias) ?? address.alias
    });
  }

  async deleteAddress({ id, user }: { id: number; user: User }): Promise<void> {
    const address = await this.getAddressById(id);
    checkAuthorization(user, address);
    await this.addressRepository.delete(id);
  }
}
