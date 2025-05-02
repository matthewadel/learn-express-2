import { EntityTarget, FindOneOptions, ObjectLiteral } from "typeorm";
import { BadRequestError, NotFoundError } from "./errors";
import { AppDataSource } from "../models";

export async function findOneBy<T>(
  entity: EntityTarget<ObjectLiteral>,
  {
    id,
    name,
    email,
    options,
    checkExistence
  }: {
    id?: number;
    name?: string;
    email?: string;
    options?: FindOneOptions<ObjectLiteral>;
    checkExistence?: boolean;
  }
) {
  const repo = AppDataSource.getRepository(entity);
  const item = await repo.findOne({ where: { id, name, email }, ...options });

  if (checkExistence) {
    if (item) throw new BadRequestError(`${entity} already exist`);
  } else if (!item) throw new NotFoundError(`${entity} not found`);
  return item as T;
}
