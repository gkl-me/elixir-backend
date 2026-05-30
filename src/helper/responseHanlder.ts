import { Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";

export const successResponse = <T>(
  res: Response,
  message: string,
  statusCode: STATUS_CODES,
  data: T
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  errorMessage: string,
  statusCode: STATUS_CODES,
  errorCode?: string
): void => {
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    errorCode,
  });
};
