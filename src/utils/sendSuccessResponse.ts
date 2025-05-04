import { Response } from "express";
import { dataSanitizer } from "./data-sanitizer";
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
  if (data) data = dataSanitizer<T>(data);
  res.status(statusCode || 200).send({
    success: true,
    data,
    message,
    ...(currentPage ? { currentPage, totalItems, totalPages } : {})
  });
}
