import { User } from "../models";

export function dataSanitizer<T>(
  data: T | T[] | NonNullable<T>
): T | T[] | NonNullable<T> {
  if ((data as Partial<User>).password)
    delete (data as Partial<User>)?.password;

  return data;
}
