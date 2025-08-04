


export interface IStripeService{
    createProduct:(planName:string) => Promise<string>,
    createPrice(productId:string,price:number):Promise<string>,
    findProduct(planName:string):Promise<string|null>,
    findLatestPrice(productId:string):Promise<string|null>
    createCustomer(email:string,name:string):Promise<string|null>
    createSubscription(customerId:string,priceId:string):Promise<{subscriptionId:string,clientSecret:string}|null>
    createCheckoutSession(customerId:string,priceId:string):Promise<{sessionId:string,checkoutUrl:string}>
}