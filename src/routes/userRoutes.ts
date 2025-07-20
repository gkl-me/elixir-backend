import { Router } from "express";
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IAuthController, } from "../controllers/auth/interface/IAuthController";


const router = Router();

router.post('/register',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.registerUser(req,res,next)
})
router.post('/login',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.loginUser(req,res,next)
})
router.post('/verify',(req,res,next) => {
    const authController = container.resolve<IAuthController>(Token.AuthController)
    authController.verifyUser(req,res,next)
})

export default router;