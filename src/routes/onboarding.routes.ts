import express from "express";
import { container } from "tsyringe";
import { IOnboardingController } from "../controllers/onboarding/interface/IOnboardingController";
import { Token } from "../di/token";
import { auth } from "../middlewares/auth";

const router = express.Router();
const onboardingController = container.resolve<IOnboardingController>(
  Token.OnboardingController,
);

router.get("/", auth, (req, res, next) => {
  void onboardingController.handleGetUserOnboarding(req, res, next);
});

router.patch("/step", auth, (req, res, next) => {
  void onboardingController.handleSaveOnboardingStep(req, res, next);
});

router.post("/complete", auth, (req, res, next) => {
  void onboardingController.handleCompleteOnboarding(req, res, next);
});

router.post("/complete-payment", auth, (req, res, next) => {
  void onboardingController.handleCompleteOnboardingPayment(req, res, next);
});

router.patch("/change-plan", auth, (req, res, next) => {
  void onboardingController.handleChangePlan(req, res, next);
});

export default router;
