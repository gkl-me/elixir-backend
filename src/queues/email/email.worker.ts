import { Worker } from "bullmq";
import {
  sendOtpEmailJobProccessor,
  sendVerificationEmailProccessor,
} from "./email.processor";
import { redisConnection } from "../../config/redis";
import { QUEUES } from "../queues";
import { EMAIL_JOBS } from "./email.job";

export const emailWorker = new Worker(
  QUEUES.EMAIL,
  async (job) => {
    switch (job.name) {
      case EMAIL_JOBS.SEND_VERIFY_EMAIL:
        await sendVerificationEmailProccessor(job);
        break;
      case EMAIL_JOBS.SEND_OTP_EMAIL:
        await sendOtpEmailJobProccessor(job);
        break;
      default:
        break;
    }
  },
  {
    connection: redisConnection,
  }
);
