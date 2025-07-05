import Stripe from "stripe";
import { injectable } from "tsyringe";
import { CustomError } from "../errors/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";
import { IStripeService } from "./interfaces/IStripeService";

@injectable()
export class StripeService implements IStripeService{
    private stripe:Stripe

    constructor(){
        const key = process.env.STRIPE_KEY
        if(!key){
            throw new CustomError('Stripe key is missing',STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        this.stripe = new Stripe(key)
    }

    async createProduct(planName: string){
        try {
            const product = await this.stripe.products.create({
                name:planName,
                metadata:{
                    planName
                }
            })

            return product.id
        } catch (error) {
            throw new CustomError('Failed to create stripe product',STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async createPrice(productId: string, price: number): Promise<string> {
        try {
            const stripePrice = await this.stripe.prices.create({
                product:productId,
                unit_amount:price,
                currency:'usd',
                recurring:{
                    interval:"month"
                }
            })
            return stripePrice.id
        } catch (error) {
            throw new CustomError('Failed to create stripe price',STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findProduct(planName: string): Promise<string | null> {
        try {

            const products = await this.stripe.products.list({
                limit:100
            })

            const existingProduct = products.data.find(p => p.metadata.planName == planName)
            let productId = existingProduct?.id ?? null
            return productId

        } catch (error) {
            throw new CustomError("Error while find the product",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findLatestPrice(productId: string): Promise<string | null> {
        try {
            const prices = await this.stripe.prices.list({
                product:productId,
                limit:100,
            })

            const latestPrice = prices.data.filter( p  => p.active).sort((a,b) => b.created - a.created)[0]

            return latestPrice?.id || null
        } catch (error) {
            throw new CustomError("Error while find the price",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}