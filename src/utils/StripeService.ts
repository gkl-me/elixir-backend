import Stripe from "stripe";
import { injectable } from "tsyringe";
import { CustomError } from "../errors/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";
import { IStripeService } from "./interfaces/IStripeService";
import logger from "../middlewares/logger";
import { CONSTANT_MESSAGES, PLAN_MESSAGES } from "../constants/messages";
import { ENV } from "../constants/env";

@injectable()
export class StripeService implements IStripeService{
    private _stripe:Stripe

    constructor(){
        const key = process.env.STRIPE_KEY
        if(!key){
            logger.error('Stripe key env is empty')
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        this._stripe = new Stripe(key)
    }

    async createProduct(planName: string){
        try {
            const product = await this._stripe.products.create({
                name:planName,
                metadata:{
                    planName
                }
            })

            return product.id
        } catch (error) {
            logger.error(error)
            throw new CustomError(PLAN_MESSAGES.STRIPE_PRODUCT_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async createPrice(productId: string, price: number): Promise<string> {
        try {
            const stripePrice = await this._stripe.prices.create({
                product:productId,
                unit_amount:price,
                currency:'usd',
                recurring:{
                    interval:"month"
                }
            })
            return stripePrice.id
        } catch (error) {
            logger.error(error)
            throw new CustomError(PLAN_MESSAGES.STRIPE_PRICE_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findProduct(planName: string): Promise<string | null> {
        try {

            const products = await this._stripe.products.list({
                limit:100
            })

            const existingProduct = products.data.find(p => p.metadata.planName == planName)
            let productId = existingProduct?.id ?? null
            return productId

        } catch (error) {
            logger.error(error)
            throw new CustomError(PLAN_MESSAGES.STRIPE_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findLatestPrice(productId: string): Promise<string | null> {
        try {
            const prices = await this._stripe.prices.list({
                product:productId,
                limit:100,
            })

            const latestPrice = prices.data.filter( p  => p.active).sort((a,b) => b.created - a.created)[0]

            return latestPrice?.id || null
        } catch (error) {
            logger.error(error)
            throw new CustomError(PLAN_MESSAGES.STRIPE_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async createCustomer(email: string, name: string): Promise<string | null> {
        try {

            const customer = await this._stripe.customers.create({
                email,
                name,
            })

            return customer?.id || null
        } catch (error) {
            logger.error(error)
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async createSubscription(customerId: string, priceId: string): Promise<{ subscriptionId: string; clientSecret: string; } | null> {
        try {

            const subscription = await this._stripe.subscriptions.create({
                customer:customerId,
                items:[{
                    price:priceId,
                }],
                payment_behavior:'default_incomplete',
                expand:['latest_invoice.confirmation_secret']
            })

            interface InvoiceType extends Stripe.Invoice{
                confirmation_secret:{
                    client_secret:string
                    type:string
                }
            }

            const invoice = subscription.latest_invoice as InvoiceType
            

            return  {
                subscriptionId:subscription.id,
                clientSecret:invoice.confirmation_secret.client_secret
            }

        } catch (error) {
            logger.error(error)
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async createCheckoutSession(customerId: string, priceId: string): Promise<{ sessionId: string; checkoutUrl: string; }> {
        try {
            
            const session = await this._stripe.checkout.sessions.create({
                customer:customerId,
                payment_method_types:['card','us_bank_account'],
                mode:'subscription',
                line_items:[{
                    price:priceId,
                    quantity:1
                }],
                success_url:`${ENV.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url:`${ENV.CLIENT_URL}/subscription/cancel`
            })

            //maybe add metadata for future user
            return{
                sessionId:session.id,
                checkoutUrl:session.url||""
            }

        } catch (error) {
            logger.error("Failed to create checkout session",error)
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}