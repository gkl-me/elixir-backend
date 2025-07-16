import { Router } from "express";
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IUserAuthController } from "../controllers/user/interface/IUserAuthController";
import { IUserVerifyController } from "../controllers/user/interface/IUserVerifyController";


const router = Router();

router.post('/register',(req,res,next) => {
    const userAuthController = container.resolve<IUserAuthController>(Token.UserAuthController)
    userAuthController.registerUser(req,res,next)
})
router.post('/login',(req,res,next) => {
    const userAuthController = container.resolve<IUserAuthController>(Token.UserAuthController)
    userAuthController.loginUser(req,res,next)
})

router.post('/verify',(req,res,next) => {
    const userVerifyController = container.resolve<IUserVerifyController>(Token.UserVerifyController)
    userVerifyController.verifyUser(req,res,next)
})

export default router;