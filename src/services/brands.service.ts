import { Like } from "typeorm";
import { AppDataSource } from "../models/data-source";
import { BadRequestError } from "../utils/errors";
import { getPaginatedResult } from "../utils/getPaginatedResult";
import { Brand } from "../models/entities/brand.entity";
import { findOneBy } from "../utils/findOneBy";

export class BrandsService {
  private BrandsRepository = AppDataSource.getRepository(Brand);

  async createBrand(name: string): Promise<Brand> {
    const brand = await this.BrandsRepository.findOneBy({ name });
    if (brand) throw new BadRequestError("This Brand Already Exists");

    const newBrand = this.BrandsRepository.create({ name });
    return await this.BrandsRepository.save(newBrand);
  }

  async getAllBrands(
    page: number = 1,
    limit: number = 10,
    name?: string
  ): Promise<{
    data: Brand[];
    totalPages: number;
    totalItems: number;
  }> {
    return await getPaginatedResult<Brand>(Brand, page, limit, {
      where: { name: Like(`%${name || ""}%`) }
    });
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
