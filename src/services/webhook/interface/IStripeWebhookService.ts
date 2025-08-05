import Stripe from "stripe";



export interface IStripeWebhookService{
    handleEvent(event:Stripe.Event):Promise<void>
}