import { ICheckoutDto, ICheckoutResponseDto, IRetryPaymentDto, IRetryPaymentResponseDto, IVerifyPaymentDto } from "../../../interfaces/dtos/PaymentDto"



export interface IPaymentService {
    startCheckout(data:ICheckoutDto):Promise<ICheckoutResponseDto>
    verifyPayment(data:IVerifyPaymentDto):Promise<boolean>
    retryPayment(data:IRetryPaymentDto):Promise<IRetryPaymentResponseDto>
}