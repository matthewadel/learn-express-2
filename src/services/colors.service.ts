import { AppDataSource } from "../models";
import { Color } from "../models";
import { findOneBy } from "../utils";
import { BadRequestError } from "../utils";
import { getPaginatedResultsWithFilter, paginationInput } from "../utils";
import { z } from "zod";
import { colorsSchema } from "../schemas";

type CreateColorBody = z.infer<typeof colorsSchema.createColor>;

export class ColorsService {
  private colorsRepository = AppDataSource.getRepository(Color);

  async createColor(body: CreateColorBody["body"]) {
    const color = await this.getColorByName(body.name);
    if (color) throw new BadRequestError("This Color Already Exists");

    return this.colorsRepository.save(body);
  }

  async getAllColors(requestParams: paginationInput<Color>) {
    return await getPaginatedResultsWithFilter<Color>({
      entity: Color,
      getImtesParams: requestParams,
      search_columns: ["name"]
    });
  }

  async getColorById(id: number) {
    return findOneBy<Color>(Color, {
      id
    });
  }

  async getColorByName(name: string) {
    return findOneBy<Color>(Color, {
      name,
      checkExistence: true
    });
  }

  async deleteColor(id: number) {
    const color = await this.getColorById(id);

    await this.colorsRepository.remove(color);
  }
}
