import Stripe from "stripe"



export interface IStripeService{
    createProduct:(planName:string) => Promise<string>,
    createPrice(productId:string,price:number):Promise<string>,
    findProduct(planName:string):Promise<string|null>,
    findLatestPrice(productId:string):Promise<string|null>,
    getPrice(priceId:string):Promise<Stripe.Price>,
    createCustomer(email:string,name:string):Promise<string|null>
    createCheckoutSession(customerId:string,priceId:string,planId:string,userId:string):Promise<{sessionId:string,checkoutUrl:string}>
    constructEvent(payload:Buffer,signature:string):Promise<Stripe.Event>
    handleStripeEvent(event:Stripe.Event):Promise<void>
}