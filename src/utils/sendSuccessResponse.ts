import { Response } from "express";
import { User } from "../models";
export function sendSuccessResponse<T>({
  res,
  statusCode,
  data = null,
  message = "",
  currentPage,
  totalItems,
  totalPages
}: {
  res: Response;
  statusCode?: number;
  data?: T | T[] | null;
  message?: string;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}): void {
  if ((data as User)?.password) delete (data as Partial<User>)?.password;
  res.status(statusCode || 200).send({
    success: true,
    data,
    message,
    ...(currentPage ? { currentPage, totalItems, totalPages } : {})
  });
}
