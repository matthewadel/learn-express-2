import fs from "fs";
import "dotenv/config";
import { CategoryService } from "./../../services/categories.service";
import { initializeDB } from "../../models/data-source";
import { AppDataSource } from "../../models/data-source";
import { ProductsService } from "../../services/products.service";
import { BrandsService, SubCategoriesService } from "../../services";
import { ColorsService } from "../../services/colors.service";

const seedBrands = async () => {
  try {
    const brands = JSON.parse(
      fs.readFileSync(__dirname + "/brands.json", "utf-8")
    );

    const brandsService = new BrandsService();
    for (const brand of brands) {
      try {
        await brandsService.createBrand(brand);
      } catch (error) {
        console.log("brand", brand);
        throw new Error((error as Error).message);
      }
    }

    console.log("Brands have been seeded successfully ✅");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding brands:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

const seedCategories = async () => {
  try {
    const categories = JSON.parse(
      fs.readFileSync(__dirname + "/categories.json", "utf-8")
    );

    const categoryService = new CategoryService();

    for (const category of categories) {
      try {
        await categoryService.createCategory(category);
      } catch (error) {
        console.log("category", category);
        throw new Error((error as Error).message);
      }
    }

    console.log("Categories have been seeded successfully ✅");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

const seedSubCategories = async () => {
  try {
    const subCategories = JSON.parse(
      fs.readFileSync(__dirname + "/subcategories.json", "utf-8")
    );

    const subCategoriesService = new SubCategoriesService();

    for (const subCategory of subCategories) {
      try {
        await subCategoriesService.createSubCategory({
          ...subCategory
        });
      } catch (error) {
        console.log("subCategory", subCategory);
        throw new Error((error as Error).message);
      }
    }

    console.log("SubCategories have been seeded successfully ✅");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding Subcategory:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

const seedColors = async () => {
  try {
    const colors = JSON.parse(
      fs.readFileSync(__dirname + "/colors.json", "utf-8")
    );

    const colorsService = new ColorsService();

    for (const color of colors) {
      try {
        await colorsService.createColor(color);
      } catch (error) {
        console.log("color", color);
        throw new Error((error as Error).message);
      }
    }

    console.log("colors have been seeded successfully ✅");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding colors:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

const seedProducts = async () => {
  try {
    const products = JSON.parse(
      fs.readFileSync(__dirname + "/products.json", "utf-8")
    );

    // const productRepository = AppDataSource.getRepository(Product);
    const productsService = new ProductsService();
    for (const product of products) {
      try {
        await productsService.createProduct(product);
      } catch (error) {
        console.log("product", product);
        throw new Error((error as Error).message);
      }
    }

    console.log("Products have been seeded successfully ✅");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

const seedData = async () => {
  await seedBrands();
  await seedCategories();
  await seedSubCategories();
  await seedColors();
  await seedProducts();
  process.exit();
};

const deleteData = async () => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.query(`DROP TABLE IF EXISTS brands CASCADE`);
    console.log("Brands table has been deleted successfully!");
    await queryRunner.query(`DROP TABLE IF EXISTS categories CASCADE`);
    console.log("Categories have been deleted successfully!");
    await queryRunner.query(`DROP TABLE IF EXISTS "sub-categories" CASCADE`);
    console.log("SubCategories have been deleted successfully!");
    await queryRunner.query(`DROP TABLE IF EXISTS images CASCADE`);
    console.log("Images have been deleted successfully!");
    await queryRunner.query(`DROP TABLE IF EXISTS products_colors CASCADE`);
    console.log("products_colors have been deleted successfully!");
    await queryRunner.query(
      `DROP TABLE IF EXISTS products_sub_categories CASCADE`
    );
    console.log("products_sub_categories have been deleted successfully!");
    await queryRunner.query(`DROP TABLE IF EXISTS colors CASCADE`);
    console.log("Colors have been deleted successfully!");
    await queryRunner.query(`DROP TABLE IF EXISTS products CASCADE`);
    console.log("Products have been deleted successfully!");
    process.exit();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

//  npx ts-node src/utils/seeding/seeder.ts -i
initializeDB().then(() => {
  if (process.argv[2] === "-i") seedData();
  else if (process.argv[2] === "-d") deleteData();
});
