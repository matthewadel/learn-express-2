// this component will search only or filter only, so it can't search and filter data in the same time
// or you have to send search_columns as a string instead of an array
// it is better to serperate search logic from filter logic

import {
  Between,
  EntityTarget,
  Equal,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  ObjectLiteral
} from "typeorm";
import { AppDataSource } from "../models/data-source";

export type paginationInput<T> = {
  page: number;
  limit: number;
  search_text?: string;
  sort_by?: string;
  sort_direction?: "ASC" | "DESC";
  filter_by?: keyof T;
  filter_operator?: keyof typeof operatorMap;
  filter_value?: string;
};

export const operatorMap = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eq: (value: any) => Equal(value),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gt: (value: any) => MoreThan(value),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gte: (value: any) => MoreThanOrEqual(value),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lt: (value: any) => LessThan(value),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lte: (value: any) => LessThanOrEqual(value),
  like: (value: string) => Like(`%${value}%`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  between: (value: [any, any]) => Between(value[0], value[1]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  in: (value: any[]) => In(value)
};

export async function getPaginatedResultsWithFilter<T>(
  entity: EntityTarget<ObjectLiteral>,
  getImtesParams: paginationInput<keyof EntityTarget<ObjectLiteral>>,
  search_columns: string[],
  inputOptions?: FindManyOptions<ObjectLiteral>
): Promise<{ totalPages: number; totalItems: number; data: T[] }> {
  const page = getImtesParams.page || 1;
  const limit = getImtesParams.limit || 10;
  const skip = (page - 1) * limit;

  let options: FindManyOptions<ObjectLiteral> = { where: [] };

  if (getImtesParams.sort_by)
    options.order = {
      [`${getImtesParams.sort_by}`]: getImtesParams.sort_direction || "DESC"
    };

  if (search_columns?.length && !!getImtesParams.search_text) {
    search_columns.map((column) => {
      options.where = [
        options.where as FindOptionsWhere<ObjectLiteral>,
        { [`${column}`]: ILike(`%${getImtesParams.search_text}%`) }
      ];
    });

    if (inputOptions?.where) {
      options.where = [
        options.where as FindOptionsWhere<ObjectLiteral>,
        inputOptions.where as FindOptionsWhere<ObjectLiteral>
      ];
      delete inputOptions.where;
    }

    options = { ...options, ...inputOptions };
  } else {
    if (
      getImtesParams.filter_by &&
      getImtesParams.filter_operator &&
      getImtesParams.filter_value
    ) {
      if (
        getImtesParams.filter_operator === "between" ||
        getImtesParams.filter_operator === "in"
      )
        options.where = {
          ...(options.where as FindOptionsWhere<ObjectLiteral>),
          [`${String(getImtesParams.filter_by)}`]: operatorMap[
            getImtesParams.filter_operator
          ](JSON.parse(getImtesParams.filter_value || "[]"))
        };
      else
        options.where = {
          ...(options.where as FindOptionsWhere<ObjectLiteral>[]),
          [`${String(getImtesParams.filter_by)}`]: operatorMap[
            getImtesParams.filter_operator
          ](getImtesParams.filter_value)
        };
    }

    if (inputOptions?.where) {
      options.where = {
        ...(options.where as FindOptionsWhere<ObjectLiteral>),
        ...(inputOptions.where as FindOptionsWhere<ObjectLiteral>)
      };
      delete inputOptions.where;
    }

    options = { ...options, ...inputOptions };
  }

  console.log(options);
  const repo = AppDataSource.getRepository(entity);
  const [data, totalItems] = await repo.findAndCount({
    skip,
    take: limit,
    ...options
  });

  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalPages,
    totalItems,
    data: data as T[]
  };
}

// sanitize-html
