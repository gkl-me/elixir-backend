import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const QUEUES = {
  EMAIL: "email_queue",
  STRIPE: "stripe_queue",
};

export const emailQueue = new Queue(QUEUES.EMAIL, {
  connection: redisConnection,
});
export const stripeQueue = new Queue(QUEUES.STRIPE, {
  connection: redisConnection,
});
