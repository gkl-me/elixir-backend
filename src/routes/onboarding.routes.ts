import express from 'express'
import { container } from 'tsyringe'
import { IOnboardingController } from '../controllers/onboarding/interface/IOnboardingController'
import { Token } from '../di/token'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'


const router = express.Router()


router.get('/',auth,(req,res,next) => {
    const onboardingController = container.resolve<IOnboardingController>(Token.OnboardingController)
    onboardingController.handleGetUserOnboarding(req,res,next)
})
router.patch('/step',auth,(req,res,next) => {
    const onboardingController = container.resolve<IOnboardingController>(Token.OnboardingController)
    onboardingController.handleSaveOnboardingStep(req,res,next)
})
router.post('/complete',auth,(req,res,next) => {
    const onboardingController = container.resolve<IOnboardingController>(Token.OnboardingController)
    onboardingController.handleCompleteOnboarding(req,res,next)
})
router.post('/complete-payment',auth,(req,res,next) => {
    const onboardingController = container.resolve<IOnboardingController>(Token.OnboardingController)
    onboardingController.handleCompleteOnboardingPayment(req,res,next)
})
router.patch('/change-plan',auth,(req,res,next) => {
    const onboardingController = container.resolve<IOnboardingController>(Token.OnboardingController)
    onboardingController.handleChangePlan(req,res,next)
})


export default router