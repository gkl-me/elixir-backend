import express from "express";
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IStripeWebhookController } from "../controllers/webhook/interface/IStripeWebhookController";

const router = express.Router();

const stripeWebhookController = container.resolve<IStripeWebhookController>(
  Token.StripeWebhookController,
);

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    void stripeWebhookController.handle(req, res, next);
  },
);

export default router;
