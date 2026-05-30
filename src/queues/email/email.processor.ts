import { Job } from "bullmq";
import logger from "../../middlewares/logger";
import { container } from "tsyringe";
import { IVerifyService } from "../../services/auth/interfaces/IVerifyService";
import { Token } from "../../di/token";
import { IOtpService } from "../../services/auth/interfaces/IOtpService";

export async function sendVerificationEmailProccessor(job: Job): Promise<void> {
  try {
    const { email } = job.data;

    const verifyService = container.resolve<IVerifyService>(
      Token.VerifyService,
    );
    await verifyService.sendVerificationEmail({
      email,
    });

    return;
  } catch (error) {
    logger.error(error);
  }
}

export async function sendOtpEmailJobProccessor(job: Job): Promise<void> {
  try {
    console.log("Otp email Proccessing");

    const { email } = job.data;

    const optService = container.resolve<IOtpService>(Token.OtpService);
    await optService.sendOtp({
      email,
    });
    return;
  } catch (error) {
    logger.error(error);
  }
}
