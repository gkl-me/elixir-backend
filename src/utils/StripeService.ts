import Stripe from "stripe";
import { injectable } from "tsyringe";
import { CustomError } from "../errors/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";
import { IStripeService } from "./interfaces/IStripeService";
import logger from "../middlewares/logger";
import { CONSTANT_MESSAGES, PLAN_MESSAGES } from "../constants/messages";

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
}