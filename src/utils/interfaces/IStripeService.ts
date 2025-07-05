


export interface IStripeService{
    createProduct:(planName:string) => Promise<string>,
    createPrice(productId:string,price:number):Promise<string>,
    findProduct(planName:string):Promise<string|null>,
    findLatestPrice(productId:string):Promise<string|null>
}