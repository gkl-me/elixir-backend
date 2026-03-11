import Stripe from "stripe"



export interface IStripeService{
    createProduct:(planName:string) => Promise<string>,
    createPrice(productId:string,price:number):Promise<string>,
    findProduct(planType:string):Promise<string|null>,
    findLatestPrice(productId:string):Promise<string|null>,
    getPrice(priceId:string):Promise<Stripe.Price>,
    createCustomer(email:string,name:string,userId:string):Promise<string|null>
    createCheckoutSession(customerId:string,priceId:string,userId:string,planId:string):Promise<{sessionId:string,payment_url:string}>
    retriveSession(sessionId:string):Promise<Stripe.Checkout.Session>
    expireSession(sessionId:string):Promise<Stripe.Checkout.Session|null>
    getSubscription(customerId:string):Promise<Stripe.Subscription|null>
    cancelSubscription(subscriptionId:string):Promise<void>
    getOpenInvoice(customerId:string):Promise<Stripe.Invoice|null>
    constructEvent(payload:Buffer,signature:string):Promise<Stripe.Event>
    getSubscriptionFromInvoice(invoice:Stripe.Invoice):Promise<Stripe.Invoice.Parent.SubscriptionDetails|null>
}