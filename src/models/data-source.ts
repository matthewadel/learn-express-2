// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "./entities";
import { getEnv } from "../utils/validateEnv";
import {
  CategorySubscriber,
  BrandSubscriber,
  ProductSubscriber,
  UserSubscriber,
  ReviewSubscriber
} from "./subscribers";

export const AppDataSource = new DataSource({
  type: getEnv().DB_TYPE as "postgres",
  host: getEnv().DB_HOST,
  port: getEnv().DB_PORT ? parseInt(getEnv().DB_PORT, 10) : 5432,
  username: getEnv().DB_USERNAME,
  password: getEnv().DB_PASSWORD, // replace with your local DB password
  database: getEnv().DB_NAME,
  synchronize: getEnv().NODE_ENV === "development",
  logging: false,
  entities,
  migrations: [],
  subscribers: [
    CategorySubscriber,
    BrandSubscriber,
    ProductSubscriber,
    UserSubscriber,
    ReviewSubscriber
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
