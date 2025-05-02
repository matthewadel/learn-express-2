import { AppDataSource } from "../models";
import { BadRequestError } from "../utils";
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
    const brand = await this.BrandsRepository.findOneBy({ name: body.name });
    if (brand) throw new BadRequestError("This Brand Already Exists");

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

  async updateBrand(id: number, body: UpdateBrandBody["body"]): Promise<Brand> {
    const brand = await findOneBy<Brand>(Brand, { id });

    await this.BrandsRepository.save({ ...brand, ...body });
    return brand;
  }

  async deleteBrand(id: number): Promise<void> {
    const brand = await findOneBy<Brand>(Brand, { id });

    await this.BrandsRepository.remove(brand);
  }
}
