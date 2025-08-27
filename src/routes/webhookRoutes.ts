import express from 'express'
import { container } from 'tsyringe'
import { Token } from '../di/token'
import { IStripeWebhookController } from '../controllers/webhook/IStripeWebhookController'


const router = express.Router()


router.post('/stripe',express.raw({type:'application/json'}),(req,res,next) =>{
    const stripeWebhookController = container.resolve<IStripeWebhookController>(Token.StripeWebhookController)
    stripeWebhookController.handle(req,res,next)
})


export default router