import { Job } from "bullmq";
import logger from "../../middlewares/logger";
import { container } from "tsyringe";
import { IVerifyService } from "../../services/auth/interfaces/IVerifyService";
import { Token } from "../../di/token";
import { IOtpService } from "../../services/auth/interfaces/IOtpService";
import { logError } from "../../middlewares/loggerHelper";
import { IWorkspaceInviteService } from "../../services/workspace/interface/IWorkspaceInviteService";

export async function sendVerificationEmailProccessor(job: Job): Promise<void> {
  try {
    const { email } = job.data;

    const verifyService = container.resolve<IVerifyService>(
      Token.VerifyService
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

export async function sendInviteEmailProccessor(job: Job): Promise<void> {
  try {
    console.log("Invite email Proccessing");

    const { email, workspaceId, roleId, invitedByUserId } = job.data;

    const inviteService = container.resolve<IWorkspaceInviteService>(
      Token.WorkspaceInviteService
    );

    await inviteService.sendInvite({
      email,
      workspaceId,
      invitedByUserId,
      roleId,
    });

    return;
  } catch (error) {
    logError(error, {
      service: "email.processor.sendInviteEmailProccessor",
    });
  }
}

export async function resendInviteEmailProccessor(job: Job): Promise<void> {
  try {
    console.log("Resend Invite email Proccessing");

    const { inviteId, workspaceId } = job.data;

    const inviteService = container.resolve<IWorkspaceInviteService>(
      Token.WorkspaceInviteService
    );

    await inviteService.resendInvite({
      inviteId,
      workspaceId,
    });

    return;
  } catch (error) {
    logError(error, {
      service: "email.processor.resendInviteEmailProccessor",
    });
  }
}
