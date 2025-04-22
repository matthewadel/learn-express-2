import { AppDataSource } from "../models/data-source";
import { BadRequestError } from "../utils/errors";
import { Brand } from "../models/entities/brand.entity";
import { findOneBy } from "../utils/findOneBy";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";

export class BrandsService {
  private BrandsRepository = AppDataSource.getRepository(Brand);

  async createBrand(name: string): Promise<Brand> {
    const brand = await this.BrandsRepository.findOneBy({ name });
    if (brand) throw new BadRequestError("This Brand Already Exists");

    const newBrand = this.BrandsRepository.create({ name });
    return await this.BrandsRepository.save(newBrand);
  }

  async getAllBrands(requestParams: paginationInput<Brand>) {
    return await getPaginatedResultsWithFilter<Brand>(Brand, requestParams, [
      "name"
    ]);
  }

  async getBrandById(id: number): Promise<Brand> {
    return await findOneBy<Brand>(Brand, { id });
  }

  async updateBrand(id: number, name?: string, image?: string): Promise<Brand> {
    const brand = await findOneBy<Brand>(Brand, { id });

    if (name) brand.name = name;
    if (image) brand.image = image;
    await this.BrandsRepository.update({ id }, brand);
    return brand;
  }

  async deleteBrand(id: number): Promise<void> {
    const brand = await findOneBy<Brand>(Brand, { id });

    await this.BrandsRepository.remove(brand);
  }
}
