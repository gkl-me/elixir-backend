import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper/responseHanlder";
import { CustomError } from "../errors/CustomError";
import logger from "./logger";
import { CONSTANT_MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err) {
    if (err instanceof CustomError) {
      logger.warn("request.failed", {
        requestId: req.requestId,
        path: req.path,
        method: req.method,
        message: err.message,
        stack: String(err.stack),
        errorCode: err.errorCode,
      });

      return errorResponse(res, err.message, err.statusCode, err.errorCode);
    }

    logger.error("request.unhandled_error", {
      requestId: req.requestId,
      path: req.path,
      method: req.method,
      message: err instanceof Error ? err.message : "Internal Server error",
      stack: err instanceof Error ? err.message : undefined,
    });

    return errorResponse(
      res,
      CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
    );
  } else {
    return next();
  }
};
