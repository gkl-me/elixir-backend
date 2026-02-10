
import express from 'express'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'
import { container } from 'tsyringe'
import { IPlanController } from '../controllers/plan/interface/IPlanController'
import { Token } from '../di/token'


const router = express.Router()

router.get('/',(req,res,next) => {
    const planController  = container.resolve<IPlanController>(Token.PlanController)
    planController.findAllPlans(req,res,next)
})

router.patch('/update/:id',auth,authorize('superAdmin'),(req,res,next) => {
    const planController  = container.resolve<IPlanController>(Token.PlanController)
    planController.updatePlan(req,res,next)
})




export default router