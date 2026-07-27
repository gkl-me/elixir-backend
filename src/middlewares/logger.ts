import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ENV } from "../constants/env";

const logDir = path.join(__dirname, "../../", "logs");

const fileFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.json() // NDJSON — one structured object per line
);

const logger = createLogger({
  level: ENV.NODE_ENV === "production" ? "info" : "debug",
  defaultMeta: { service: "elixir-api" },
  format: fileFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "7d",
      handleExceptions: true,
      handleRejections: true,
    }),
    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "7d",
    }),
  ],
});

// Pretty console output in non-production environments
if (ENV.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({ format: "HH:mm:ss" }),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : "";
          return `[${timestamp}] ${level}: ${message}${metaStr}`;
        })
      ),
    })
  );
}

export default logger;
