import { Router } from "express";
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IAuthController, } from "../controllers/auth/interface/IAuthController";
import { IPlanController } from "../controllers/plan/interface/IPlanController";
import { ISubscriptionController } from "../controllers/subscription/interface/ISubscriptionController";
import { auth } from "../middlewares/auth";
import { IVerifyController } from "../controllers/auth/interface/IVerifyController";
import { IPasswordController } from "../controllers/auth/interface/IPasswordController";
import { IOtpController } from "../controllers/auth/interface/IOtpController";


const router = Router();


//auth routes
router.post('/register',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.handleRegister(req,res,next)
})
router.post('/login',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.handleLogin(req,res,next)
})
router.post('/google-auth',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.handleGoogleAuth(req,res,next)
})
router.post('/refresh',(req,res,next) =>{
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.handleRefresh(req,res,next)
})
router.post('/logout',(req,res,next) =>{
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.handleLogout(req,res,next)
})

//verify email routes
router.get('/verify/:token',(req,res,next) => {
    const verifyController = container.resolve<IVerifyController>(Token.VerifyController)
    verifyController.handleVerifyEmail(req,res,next)
})
router.post('/resend-email',(req,res,next) => {
    const verifyController = container.resolve<IVerifyController>(Token.VerifyController)
    verifyController.handleResendVerifyEmail(req,res,next)
})


//otp routes
router.post('/verify-otp',(req,res,next) => {
    const otpController = container.resolve<IOtpController>(Token.OtpController)
    otpController.handleVerifyOtp(req,res,next)
})
router.post('/resend-otp',(req,res,next) => {
    const otpController = container.resolve<IOtpController>(Token.OtpController)
    otpController.handleResendOtp(req,res,next)
})


router.post('/forgot-password',(req,res,next) => {
    const passwordController = container.resolve<IPasswordController>(Token.PasswordController)
    passwordController.handleForgotPassword(req,res,next) 
})
router.post('/reset-password',(req,res,next)=>{
    const passwordController = container.resolve<IPasswordController>(Token.PasswordController)
    passwordController.handleResetPasswrod(req,res,next) 
})



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