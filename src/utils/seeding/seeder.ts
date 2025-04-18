import fs from "fs";
import "dotenv/config";
import { initializeDB } from "../../models/data-source";
import { Product } from "../../models/entities/product.entity";
import { AppDataSource } from "../../models/data-source";

const seedProducts = async () => {
  try {
    await initializeDB();

    const products = JSON.parse(
      fs.readFileSync(__dirname + "/products.json", "utf-8")
    );

    const productRepository = AppDataSource.getRepository(Product);
    for (const product of products) {
      try {
        await productRepository.save(product);
      } catch (error) {
        console.log("product", product);
        throw new Error("error inserting product");
      }
    }

    console.log("Products have been seeded successfully!");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

const deleteData = async () => {
  try {
    await initializeDB();
    const productRepository = AppDataSource.getRepository(Product);
    await productRepository.delete({});
    console.log("Products have been deleted successfully!");
    return; // Exit the function instead of using process.exit()
  } catch (error) {
    console.error("Error deleting products:", error);
    throw error; // Throw the error instead of using process.exit()
  }
};

//  npx ts-node src/utils/seeding/seeder.ts -i
if (process.argv[2] === "-i") {
  seedProducts();
} else if (process.argv[2] === "-d") {
  deleteData();
}

// can you please create seeding data note that:

// images (optional): accepts array of strings
// colors (mandatory): accepts array of integers and must be one of these colors: [1,4,5]
// brand (mandatory): accepts number and must be one of these brands [2,3,4]
// category (mandatory): accepts number and must be one of these brands [2,3,6]
// subCategories (optional): accepts array of numbers and note that subcategory must belong to category and the data inside the db is as follow
// category with id 2 has sub categories with ids of [4,5]
// category with id 3 has sub categories with ids of [6,7]
// category with id 6 has sub categories with ids of [8,9]
