import { AppDataSource } from "../models/data-source";
import { Image } from "../models/entities/image.entity";
import { findOneBy } from "../utils/findOneBy";

export class ImagesService {
  private imageRepository = AppDataSource.getRepository(Image);

  async createImage(url: string) {
    return this.imageRepository.save({ url });
  }

  async deleteImage(id: number) {
    const image = await findOneBy<Image>(Image, {
      id
    });

    await this.imageRepository.delete(image);
  }
}
