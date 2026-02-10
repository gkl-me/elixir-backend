import { Router } from "express";
import { container } from "tsyringe";
import { IUserController } from "../controllers/user/interface/IUserController";
import { Token } from "../di/token";
import { authorize } from "../middlewares/authorize";
import { auth } from "../middlewares/auth";



const router = Router()


router.get('/',auth,authorize('superAdmin'),(req,res,next) => {
    const userController = container.resolve<IUserController>(Token.UserController)
    userController.getAllUsers(req,res,next)
})
router.patch('/:id/status',auth,authorize('superAdmin'),(req,res,next) => {
    const userController = container.resolve<IUserController>(Token.UserController)
    userController.toggleBlockStatus(req,res,next)
})



export default router