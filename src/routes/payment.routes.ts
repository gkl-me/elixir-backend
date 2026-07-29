import express from "express";
import { container } from "tsyringe";
import { IPaymentController } from "../controllers/payment/interface/IPaymentController";
import { Token } from "../di/token";
import { auth } from "../middlewares/auth";

const router = express.Router();
const paymentController = container.resolve<IPaymentController>(
  Token.PaymentController
);

router.post("/verify", auth, (req, res, next) => {
  void paymentController.handleVerifyPayment(req, res, next);
});

router.post("/retry", auth, (req, res, next) => {
  void paymentController.handleRetryPayment(req, res, next);
});

router.get("/billing/:workspaceId", auth, (req, res, next) => {
  void paymentController.handleBillingInfo(req, res, next);
});

router.post("/customer-portal", auth, (req, res, next) => {
  void paymentController.handleCreateCustomerPortal(req, res, next);
});

export default router;
