import { Router } from "express";
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IAuthController } from "../controllers/auth/interface/IAuthController";
import { IVerifyController } from "../controllers/auth/interface/IVerifyController";
import { IPasswordController } from "../controllers/auth/interface/IPasswordController";
import { IOtpController } from "../controllers/auth/interface/IOtpController";

const router = Router();

const authController = container.resolve<IAuthController>(Token.AuthController);
const verifyController = container.resolve<IVerifyController>(
  Token.VerifyController
);
const otpController = container.resolve<IOtpController>(Token.OtpController);
const passwordController = container.resolve<IPasswordController>(
  Token.PasswordController
);

//auth routes
router.post("/register", (req, res, next) => {
  void authController.handleRegister(req, res, next);
});
router.post("/login", (req, res, next) => {
  void authController.handleLogin(req, res, next);
});
router.post("/google-auth", (req, res, next) => {
  void authController.handleGoogleAuth(req, res, next);
});
router.post("/github-auth", (req, res, next) => {
  void authController.handleGithubAuth(req, res, next);
});
router.post("/refresh", (req, res, next) => {
  void authController.handleRefresh(req, res, next);
});
router.post("/logout", (req, res, next) => {
  void authController.handleLogout(req, res, next);
});

//verify email routes
router.get("/verify/:token", (req, res, next) => {
  void verifyController.handleVerifyEmail(req, res, next);
});
router.post("/resend-email", (req, res, next) => {
  void verifyController.handleResendVerifyEmail(req, res, next);
});

//otp routes
router.post("/verify-otp", (req, res, next) => {
  void otpController.handleVerifyOtp(req, res, next);
});
router.post("/resend-otp", (req, res, next) => {
  void otpController.handleResendOtp(req, res, next);
});

router.post("/forgot-password", (req, res, next) => {
  void passwordController.handleForgotPassword(req, res, next);
});
router.post("/reset-password", (req, res, next) => {
  void passwordController.handleResetPasswrod(req, res, next);
});

// router.get('/plans',auth,(req,res,next) => {
//     const planController = container.resolve<IPlanController>(Token.PlanController)
//     planController.getAvailablePlans(req,res,next)
// })
// router.get('/:id/subscription',auth,(req,res,next) => {
//     const subscriptionController = container.resolve<ISubscriptionController>(Token.SubscriptionController)
//     subscriptionController.find(req,res,next)
// })
// router.post('/subscription/start',auth,(req,res,next) => {
//     const subscriptionController = container.resolve<ISubscriptionController>(Token.SubscriptionController)
//     subscriptionController.create(req,res,next)
// })

export default router;
