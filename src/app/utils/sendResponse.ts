import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
  token?: string;
};

const sendResponse = <T>(res: Response, response: TResponse<T>): void => {
  const {
    statusCode,
    success,
    message,
    data,
    token,
    totalPages,
    currentPage,
    totalItems,
  } = response;

  const responseBody: any = {
    success,
    message,
    data,
  };

  if (token) {
    responseBody.token = token;
  }

  if (totalPages !== undefined) {
    responseBody.totalPages = totalPages;
  }
  if (currentPage !== undefined) {
    responseBody.currentPage = currentPage;
  }
  if (totalItems !== undefined) {
    responseBody.totalItems = totalItems;
  }

  res.status(statusCode).json(responseBody);
};

export default sendResponse;
