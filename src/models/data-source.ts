// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "./entities";
import { CategoryGenericSubscriber } from "./entities/category.entity";
import { BrandGenericSubscriber } from "./entities/brand.entity";
import { ProductSubscriber } from "./entities/product.entity";
import { UserGenericSubscriber } from "./entities/user.entity";

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD, // replace with your local DB password
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: false,
  entities: entities,
  migrations: [],
  subscribers: [
    CategoryGenericSubscriber,
    BrandGenericSubscriber,
    ProductSubscriber,
    UserGenericSubscriber
  ]
});

export async function initializeDB() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected ✅");
  } catch (error) {
    console.log("initializint DB errors", error);
  }
}
