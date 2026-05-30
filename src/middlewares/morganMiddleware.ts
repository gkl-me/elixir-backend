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

const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
};

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());

      const match = message.match(
        /(\S+)\s+(\S+)\s+(\S+)\s+(\d{3})\s+-\s+([\d.]+)\s+ms/
      );
      if (match) {
        const [_, timestamp, _method, _url, status, _responseTime] = match;

        const formattedTime = formatTimestamp(timestamp);
        const colorizedStatus = colorizeStatus(parseInt(status));
        const colorizedMessage = message
          .replace(status, colorizedStatus)
          .replace(timestamp, formattedTime);

        console.log(colorizedMessage.trim());
      }
    },
  },
});

export default morganMiddleware;
