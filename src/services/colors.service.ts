import { Like } from "typeorm";
import { AppDataSource } from "../models/data-source";
import { Color } from "../models/entities/color.entity";
import { getPaginatedResult } from "../utils/getPaginatedResult";
import { findOneBy } from "../utils/findOneBy";
import { BadRequestError } from "../utils/errors";

export class ColorsService {
  private colorsRepository = AppDataSource.getRepository(Color);

  async createColor(name: string) {
    const color = await this.colorsRepository.findOneBy({ name });
    if (color) throw new BadRequestError("This Color Already Exists");

    const newColor = this.colorsRepository.create({ name });
    return this.colorsRepository.save(newColor);
  }

  async getAllColors(page: number, limit: number, name?: string) {
    return await getPaginatedResult<Color>(Color, page, limit, {
      where: { name: Like(`%${name || ""}%`) }
    });
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
