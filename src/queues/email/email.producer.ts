import { emailQueue } from "../queues";
import logger from "../../middlewares/logger";
import { EMAIL_JOBS } from "./email.job";
import { logError } from "../../middlewares/loggerHelper";

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

export async function sendInviteEmail(
  email: string,
  workspaceId: string,
  roleId: string,
  invitedByUserId: string
): Promise<void> {
  try {
    await emailQueue.add(EMAIL_JOBS.SEND_INVITE_EMAIL, {
      email,
      workspaceId,
      roleId,
      invitedByUserId,
    });
  } catch (error) {
    logError(error, {
      service: "email.producer.sendInviteEmail",
    });
  }
}

export async function resendInviteEmail(
  inviteId: string,
  workspaceId: string
): Promise<void> {
  try {
    await emailQueue.add(EMAIL_JOBS.RESEND_INVITE_EMAIL, {
      inviteId,
      workspaceId,
    });
  } catch (error) {
    logError(error, {
      service: "email.producer.resendInviteEmail",
    });
  }
}
