import { AppDataSource } from "../models";
import { Brand } from "../models";
import { findOneBy } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { brandsSchema } from "../schemas";
import { z } from "zod";

type CreateBrandBody = z.infer<typeof brandsSchema.createBrand>;
type UpdateBrandBody = z.infer<typeof brandsSchema.updateBrand>;
export class BrandsService {
  private BrandsRepository = AppDataSource.getRepository(Brand);

  async createBrand(body: CreateBrandBody["body"]): Promise<Brand> {
    await this.getBrandByname(body.name);
    return await this.BrandsRepository.save(body);
  }

  async getAllBrands(requestParams: paginationInput<Brand>) {
    return await getPaginatedResultsWithFilter<Brand>({
      entity: Brand,
      getImtesParams: requestParams,
      search_columns: ["name"]
    });
  }

  async getBrandById(id: number): Promise<Brand> {
    return await findOneBy<Brand>(Brand, { id });
  }

  async getBrandByname(name: string): Promise<Brand> {
    return await findOneBy<Brand>(Brand, { name, checkExistence: true });
  }

  async updateBrand(id: number, body: UpdateBrandBody["body"]): Promise<Brand> {
    const brand = await this.getBrandById(id);

    return this.BrandsRepository.save({ ...brand, ...body });
  }

  async deleteBrand(id: number): Promise<void> {
    const brand = await this.getBrandById(id);

    await this.BrandsRepository.remove(brand);
  }
}
