import { Resend } from "resend";
import { IEmailService } from "./interfaces/IEmailService";
import { CustomError } from "../errors/CustomError";
import { CONSTANT_MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import logger from "../middlewares/logger";
import { injectable } from "tsyringe";
import { ENV } from "../constants/env";

@injectable()
export class EmailService implements IEmailService {
  private _resend: Resend;

  constructor() {
    const api = ENV.RESEND_API;
    if (!api) {
      logger.error("Resend api env is empty");
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
    this._resend = new Resend(api);
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const response = await this._resend.emails.send({
        from: process.env.RESEND_FROM!,
        to,
        subject,
        html: body,
      });

      if (response.error) {
        throw new CustomError(
          response.error.message,
          STATUS_CODES.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
