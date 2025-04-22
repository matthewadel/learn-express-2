import { AppDataSource } from "../models/data-source";
import { Color } from "../models/entities/color.entity";
import { findOneBy } from "../utils/findOneBy";
import { BadRequestError } from "../utils/errors";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";

export class ColorsService {
  private colorsRepository = AppDataSource.getRepository(Color);

  async createColor(name: string) {
    const color = await this.colorsRepository.findOneBy({ name });
    if (color) throw new BadRequestError("This Color Already Exists");

    const newColor = this.colorsRepository.create({ name });
    return this.colorsRepository.save(newColor);
  }

  async getAllColors(requestParams: paginationInput<Color>) {
    return await getPaginatedResultsWithFilter<Color>(Color, requestParams, [
      "name"
    ]);
  }

  async getColorById(id: number) {
    const color = await findOneBy<Color>(Color, {
      id
    });
    return color;
  }

  async deleteColor(id: number) {
    const color = await findOneBy<Color>(Color, {
      id
    });

    await this.colorsRepository.remove(color);
  }
}
