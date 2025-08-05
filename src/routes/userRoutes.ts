import { Router } from "express";
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IAuthController, } from "../controllers/auth/interface/IAuthController";
import { IPlanController } from "../controllers/plan/interface/IPlanController";
import { ISubscriptionController } from "../controllers/subscription/interface/ISubscriptionController";
import { auth } from "../middlewares/auth";


const router = Router();

router.post('/register',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.registerUser(req,res,next)
})
router.post('/login',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.loginUser(req,res,next)
})
router.get('/verify/:token',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.verifyUser(req,res,next)
})
router.post('/google-auth',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.googleAuth(req,res,next)
})
router.post('/refresh',(req,res,next) =>{
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.refresh(req,res,next)
})
router.post('/logout',(req,res,next) =>{
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.logout(req,res,next)
})



router.get('/plans',auth,(req,res,next) => {
    const planController = container.resolve<IPlanController>(Token.PlanController)
    planController.getAvailablePlans(req,res,next)
})
router.get('/:id/subscription',auth,(req,res,next) => {
    const subscriptionController = container.resolve<ISubscriptionController>(Token.SubscriptionController)
    subscriptionController.find(req,res,next)
})
router.post('/subscription/start',auth,(req,res,next) => {
    const subscriptionController = container.resolve<ISubscriptionController>(Token.SubscriptionController)
    subscriptionController.create(req,res,next)
})

export default router;