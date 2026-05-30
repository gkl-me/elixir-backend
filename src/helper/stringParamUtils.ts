import { STATUS_CODES } from "../constants/statusCodes";
import { CustomError } from "../errors/CustomError";
import { logError } from "../middlewares/loggerHelper";

export function extractStringParams<T extends string>(
  params: Partial<Record<string, string | string[]>>,
  keys: T[],
): Record<T, string> {
  const result = {} as Record<T, string>;

  for (const key of keys) {
    const value = params[key];

    if (typeof value === "string") {
      result[key] = value;
    } else if (Array.isArray(value) && typeof value[0] === "string") {
      result[key] = value[0];
    } else {
      logError("Key is required, params dont match", {
        service: "extractStringParams",
      });
      throw new CustomError(
        "Key is required , params dont match ",
        STATUS_CODES.BAD_REQUEST,
      );
    }
  }
  return result;
}
