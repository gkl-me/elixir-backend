import { Resend } from "resend";
import { IEmailService } from "./interfaces/IEmailService";
import { CustomError } from "../errors/CustomError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCodes";
import logger from "../middlewares/logger";
import { injectable } from "tsyringe";

const resend = new Resend(process.env.RESEND_API!)


@injectable()
export class EmailService implements IEmailService{
    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        try {
            
            const {data,error} = await resend.emails.send({
                from:process.env.RESEND_FROM!,
                to,
                subject,
                text: body,
            })

            if(error){
                throw new CustomError(error.message,STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

        } catch (error) {
            logger.error(error)
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}