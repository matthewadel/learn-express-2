import { Response } from "express";
export function SendSuccessResponse<T>({
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
  res.status(statusCode || 200).send({
    success: true,
    data,
    message,
    ...(currentPage ? { currentPage, totalItems, totalPages } : {})
  });
}
