import morgan from "morgan";
import logger from "./logger";

// Define the timestamp token
morgan.token("timestamp", () => {
  return new Date().toISOString(); // ISO format timestamp
});

// Updated format including the timestamp token
const morganFormat = ":timestamp :method :url :status - :response-time ms";

const colorizeStatus = (status: number): string => {
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`;
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`;
  return `\x1b[32m${status}\x1b[0m`;
};

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());

      const match = message.match(/(\S+)\s+(\S+)\s+(\S+)\s+(\d{3})\s+-\s+([\d.]+)\s+ms/);
      if (match) {
        const [_, timestamp, method, url, status, responseTime] = match;
        const colorizedStatus = colorizeStatus(parseInt(status));
        const colorizedMessage = message.replace(status, colorizedStatus);

        // Optionally filter parts and log the message
        const msg = colorizedMessage.split(" ");
        msg.shift()
        console.log(msg.join(" ").trim())
      }
    },
  },
});

export default morganMiddleware;
