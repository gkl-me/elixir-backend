import winston from "winston";
import { CustomError } from "../errors/CustomError";
import logger from "./logger";

type LogContext = {
  requestId?: string;
  userId?: string;
  service?: string;
};

export const logInfo = (message: string, ctx?: LogContext): winston.Logger => {
  return logger.info(message, ctx);
};

export const logWarn = (message: string, ctx?: LogContext): winston.Logger => {
  return logger.warn(message, ctx);
};

export const logError = (error: unknown, ctx?: LogContext): winston.Logger => {
  if (error instanceof CustomError) {
    return logger.error({
      message: error.message,
      stack: error.stack,
      errorCode: error.errorCode,
      ...ctx,
    });
  } else {
    return logger.error({
      message: String(error),
      ...ctx,
    });
  }
};
