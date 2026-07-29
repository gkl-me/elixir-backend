import {
  ICheckoutDto,
  ICheckoutResponseDto,
  ICreateCustomerPortalDto,
  ICreateCustomerPortalResDto,
  IGetBillingDto,
  IGetBillingResDto,
  IRetryPaymentDto,
  IRetryPaymentResponseDto,
  IVerifyPaymentDto,
} from "../../../interfaces/dtos/PaymentDto";

export interface IPaymentService {
  startCheckout(data: ICheckoutDto): Promise<ICheckoutResponseDto>;
  verifyPayment(data: IVerifyPaymentDto): Promise<boolean>;
  retryPayment(data: IRetryPaymentDto): Promise<IRetryPaymentResponseDto>;
  billingInfo(data: IGetBillingDto): Promise<IGetBillingResDto>
  createCustomerPortal(data: ICreateCustomerPortalDto): Promise<ICreateCustomerPortalResDto>
}
