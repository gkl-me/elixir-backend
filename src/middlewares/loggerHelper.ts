import { CustomError } from "../errors/CustomError";
import logger from "./logger";

type LogContext = {
  requestId?: string;
  userId?: string;
  service?: string;
};

export const logInfo = (message: string, ctx?: LogContext) =>
  logger.info(message, ctx);

export const logWarn = (message: string, ctx?: LogContext) =>
  logger.warn(message, ctx);

export const logError = (error: unknown, ctx?: LogContext) => {
  if (error instanceof CustomError) {
    logger.error({
      message: error.message,
      stack: error.stack,
      errorCode: error.errorCode,
      ...ctx,
    });
  } else {
    logger.error({
      message: String(error),
      ...ctx,
    });
  }
};
