// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "./entities";

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD, // replace with your local DB password
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: true,
  entities: entities,
  migrations: [],
  subscribers: []
});

export function initializeDB() {
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected ✅");
    })
    .catch((error) => console.log(error));
}
