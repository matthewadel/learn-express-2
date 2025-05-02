import { AppDataSource } from "../models/data-source";
import { Color } from "../models/entities/color.entity";
import { findOneBy } from "../utils/findOneBy";
import { BadRequestError } from "../utils/errors";
import {
  getPaginatedResultsWithFilter,
  paginationInput
} from "../utils/getPaginatedResultsWithFilter";
import { z } from "zod";
import { colorsSchema } from "../schemas/colors.schema";

type CreateColorBody = z.infer<typeof colorsSchema.createColor>;

export class ColorsService {
  private colorsRepository = AppDataSource.getRepository(Color);

  async createColor(body: CreateColorBody["body"]) {
    const color = await this.colorsRepository.findOneBy({ name: body.name });
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
