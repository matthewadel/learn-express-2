// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "./entities";
import { CategoryGenericSubscriber } from "./entities/category.entity";
import { BrandGenericSubscriber } from "./entities/brand.entity";
import { ProductSubscriber } from "./entities/product.entity";
import { UserGenericSubscriber } from "./entities/user.entity";
import { getEnv } from "../utils/validateEnv";

export const AppDataSource = new DataSource({
  type: getEnv().DB_TYPE as "postgres",
  host: getEnv().DB_HOST,
  port: getEnv().DB_PORT ? parseInt(getEnv().DB_PORT, 10) : 5432,
  username: getEnv().DB_USERNAME,
  password: getEnv().DB_PASSWORD, // replace with your local DB password
  database: getEnv().DB_NAME,
  synchronize: getEnv().NODE_ENV === "development",
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
