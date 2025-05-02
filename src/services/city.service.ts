import { Repository } from "typeorm";
import { AppDataSource, City } from "../models";
import {
  paginationInput,
  getPaginatedResultsWithFilter,
  findOneBy,
  BadRequestError
} from "../utils";
import { citySchema } from "../schemas/city.schema";
import { z } from "zod";

type CreateCityBody = z.infer<typeof citySchema.createCity>;

type UpdateCityBody = z.infer<typeof citySchema.updateCity>;

export class CityService {
  private readonly cityRepository: Repository<City> =
    AppDataSource.getRepository(City);

  async createCity(body: CreateCityBody["body"]): Promise<City> {
    const brand = await this.getCityByName(body.name);
    if (brand) throw new BadRequestError("This City Already Exists");

    const newCity = this.cityRepository.create(body);
    return await this.cityRepository.save(newCity);
  }

  async getAllCities(query: paginationInput<City>) {
    return await getPaginatedResultsWithFilter<City>({
      entity: City,
      getImtesParams: query,
      search_columns: ["name"]
    });
  }

  async getCityById(id: number): Promise<City> {
    return findOneBy<City>(City, { id });
  }

  async getCityByName(name: string): Promise<City> {
    return findOneBy<City>(City, { name, checkExistence: true });
  }

  async updateCity(id: number, data: UpdateCityBody["body"]): Promise<City> {
    const city = await this.getCityById(id);
    Object.assign(city, data);
    return await this.cityRepository.save(city);
  }

  async deleteCity(id: number): Promise<void> {
    const city = await this.getCityById(id);
    await this.cityRepository.delete(city.id);
  }
}
