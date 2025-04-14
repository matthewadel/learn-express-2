import { SubCategoriesService } from "../services/subCategories.service";

export class SubCategoryController {
  private readonly subCategoriesService: SubCategoriesService =
    new SubCategoriesService();
}
