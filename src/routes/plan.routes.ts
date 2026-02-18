
import express from 'express'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'
import { container } from 'tsyringe'
import { IPlanController } from '../controllers/plan/interface/IPlanController'
import { Token } from '../di/token'


const router = express.Router()

router.get('/',(req,res,next) => {
    const planController  = container.resolve<IPlanController>(Token.PlanController)
    planController.handleFindAllPlans(req,res,next)
})

router.post('/create',auth,authorize('superAdmin'),(req,res,next) => {
    const planController  = container.resolve<IPlanController>(Token.PlanController)
    planController.handleCreatePlan(req,res,next)
})

router.patch('/toggle/:id',auth,authorize('superAdmin'),(req,res,next) => {
    console.log("controller called")
    const planController  = container.resolve<IPlanController>(Token.PlanController)
    planController.handleTogglePlanStatus(req,res,next)
})




export default router