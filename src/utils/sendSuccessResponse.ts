import { Response } from "express";
export const SendSuccessResponse = ({
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
  data?: any;
  message?: string;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}): void => {
  res.status(statusCode || 200).send({
    success: true,
    data,
    message,
    ...(currentPage ? { currentPage, totalItems, totalPages } : {})
  });
};
