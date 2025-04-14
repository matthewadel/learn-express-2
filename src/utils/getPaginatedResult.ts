import { EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";
import { AppDataSource } from "../models/data-source";

export async function getPaginatedResult<T>(
  entity: EntityTarget<ObjectLiteral>,
  page: number,
  limit: number,
  options?: FindManyOptions<ObjectLiteral>
): Promise<{ totalPages: number; totalItems: number; data: T[] }> {
  const repo = AppDataSource.getRepository(entity);
  const [data, totalItems] = await repo.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: "DESC" },
    ...options
  });

  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalPages,
    totalItems,
    data: data as T[]
  };
}
