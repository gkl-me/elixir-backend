import path from "path";
import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ENV } from "../constants/env";

const logDir = path.join(__dirname, "../../", "logs");

const logger = createLogger({
  level: ENV.NODE_ENV === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.prettyPrint(),
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "7d",
    }),
    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "7d",
    }),
  ],
});

export default logger;
