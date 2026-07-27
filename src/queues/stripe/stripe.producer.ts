import Stripe from "stripe";
import { stripeQueue } from "../queues";
import { STRIPE_JOBS } from "./stripe.job";
import logger from "../../middlewares/logger";

export async function addStripeJob(event: Stripe.Event): Promise<void> {
  try {
    await stripeQueue.add(STRIPE_JOBS.HANDLE_EVENT, { event });
    return;
  } catch (error) {
    logger.error("Failed to add stripe job", error);
  }
}
