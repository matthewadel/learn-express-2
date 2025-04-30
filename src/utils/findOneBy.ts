import { EntityTarget, FindOneOptions, ObjectLiteral } from "typeorm";
import { NotFoundError } from "./errors";
import { AppDataSource } from "../models/data-source";

export async function findOneBy<T>(
  entity: EntityTarget<ObjectLiteral>,
  {
    id,
    name,
    email,
    options
  }: {
    id?: number;
    name?: string;
    email?: string;
    options?: FindOneOptions<ObjectLiteral>;
  }
) {
  const repo = AppDataSource.getRepository(entity);
  const item = await repo.findOne({ where: { id, name, email }, ...options });
  if (!item) throw new NotFoundError(`${entity} not found`);
  return item as T;
}
