import { inject, injectable } from "tsyringe";
import { IStripeWebhookService } from "./interface/IStripeWebhookService";
import Stripe from "stripe";
import logger from "../../middlewares/logger";
import { Token } from "../../di/token";
import { ISubscriptionService } from "../subscription/interface/ISubscriptionService";


@injectable()
export class StripeWebhookService implements IStripeWebhookService{
    constructor(
        @inject(Token.SubscriptionService) private _subscriptionService:ISubscriptionService
    ){}

    async handleEvent(event: Stripe.Event): Promise<void> {
        try {

            switch (event.type){
                case 'checkout.session.completed':
                    
                    const session_data = event.data.object?.metadata
                    const stripeSubscriptionId = event.data.object.subscription?.toString()
                    await this._subscriptionService.handleCheckoutComplete({metadata:session_data,stripeSubscriptionId})
                    break;

                case 'invoice.payment_succeeded':

                    const payment_data = event.data.object.parent?.subscription_details?.subscription.toString() || null
                    await this._subscriptionService.handleInvoicePaymentSuccess({subId:payment_data})
                    break;

                case 'invoice.payment_failed':

                    const payment_fail_data = event.data.object.parent?.subscription_details?.subscription.toString() || null
                    const invoice_url = event.data.object.hosted_invoice_url?.toString() || null
                    await this._subscriptionService.handleInvoicePaymentFailure({subId:payment_fail_data,invoiceUrl:invoice_url})
                    break;
            }

        } catch (error) {
            logger.error(error)
        }
    }
}

