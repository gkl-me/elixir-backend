import { emailQueue } from "../queues";
import logger from "../../middlewares/logger";
import { EMAIL_JOBS } from "./email.job";

export async function sendVerificationEmailJob(email: string): Promise<void> {
  try {
    await emailQueue.add(EMAIL_JOBS.SEND_VERIFY_EMAIL, {
      email,
    });
    return;
  } catch (error) {
    logger.error(error);
  }
}

export async function sendOtpEmailJob(email: string): Promise<void> {
  try {
    await emailQueue.add(EMAIL_JOBS.SEND_OTP_EMAIL, {
      email,
    });
    return;
  } catch (error) {
    logger.error(error);
  }
}
