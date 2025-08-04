import { CreateCheckoutDto, CreateCheckoutResponseDto, SubscriptionDto, SubscriptionResponseDto } from "../../../interfaces/dtos/SubscriptionDto";


export interface ISubscriptionService{
    createCheckout(data:CreateCheckoutDto):Promise<CreateCheckoutResponseDto>
}