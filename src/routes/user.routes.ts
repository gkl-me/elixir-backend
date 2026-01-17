import { Router } from "express";
import { container } from "tsyringe";
import { IUserController } from "../controllers/user/interface/IUserController";
import { Token } from "../di/token";
import { authorize } from "../middlewares/authorize";



const router = Router()


router.get('/',authorize('superAdmin'),(req,res,next) => {
    const userController = container.resolve<IUserController>(Token.UserController)
    userController.getAllUsers(req,res,next)
})
router.patch('/:id/status',authorize('superAdmin'),(req,res,next) => {
    const userController = container.resolve<IUserController>(Token.UserController)
    userController.toggleBlockStatus(req,res,next)
})



export default router