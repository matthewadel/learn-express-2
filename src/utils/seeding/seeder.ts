import fs from "fs";
import "dotenv/config";
import { CategoryService, CityService, UsersService } from "./../../services";
import { initializeDB } from "../../models";
import { AppDataSource } from "../../models";
import { ProductsService } from "../../services";
import { BrandsService, SubCategoriesService } from "../../services";
import { ColorsService } from "../../services";

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

const seedUsers = async () => {
  try {
    const users = JSON.parse(
      fs.readFileSync(__dirname + "/users.json", "utf-8")
    );

    // const productRepository = AppDataSource.getRepository(Product);
    const usersService = new UsersService();
    for (const user of users) {
      try {
        await usersService.seedUser(user);
      } catch (error) {
        console.log("user", user);
        throw new Error((error as Error).message);
      }
    }

    console.log("Users have been seeded successfully ✅");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding users:", error);
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
        console.log(error);
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

const seedCities = async () => {
  try {
    const cities = JSON.parse(
      fs.readFileSync(__dirname + "/cities.json", "utf-8")
    );

    // const productRepository = AppDataSource.getRepository(Product);
    const cityService = new CityService();
    for (const city of cities) {
      try {
        await cityService.createCity(city);
      } catch (error) {
        console.log("city", city);
        console.log(error);
        throw new Error((error as Error).message);
      }
    }

    console.log("Cities have been seeded successfully ✅");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding citites:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

const seedData = async () => {
  await seedBrands();
  await seedCategories();
  await seedSubCategories();
  await seedColors();
  await seedUsers();
  await seedProducts();
  await seedCities();
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
    await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);
    console.log("Users table has been deleted successfully!");
    await queryRunner.query(`DROP TABLE IF EXISTS cities CASCADE`);
    console.log("Cities table has been deleted successfully!");
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
