
import express from 'express'
import { container } from 'tsyringe'
import { IPaymentController } from '../controllers/payment/interface/IPaymentController'
import { Token } from '../di/token'
import { auth } from '../middlewares/auth'

const router = express.Router()


router.post('/verify',auth,(req,res,next) => {
    const paymentController = container.resolve<IPaymentController>(Token.PaymentController)
    paymentController.handleVerifyPayment(req,res,next)
})

router.post('/retry',auth,(req,res,next) => {
    const paymentController = container.resolve<IPaymentController>(Token.PaymentController)
    paymentController.handleRetryPayment(req,res,next)
})


export default router