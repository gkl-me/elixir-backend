import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IStripeService } from "../../providers/interfaces/IStripeService";
import logger from "../../middlewares/logger";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
import { IPaymentService } from "./interface/IPaymentService";
import {
  ICheckoutDto,
  ICheckoutResponseDto,
  IRetryPaymentDto,
  IRetryPaymentResponseDto,
  IVerifyPaymentDto,
} from "../../interfaces/dtos/PaymentDto";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(Token.StripeService)
    private readonly _stripeService: IStripeService,
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(Token.PlanRepository)
    private readonly _planRepository: IPlanRepository,
  ) {}

  async startCheckout(data: ICheckoutDto): Promise<ICheckoutResponseDto> {
    try {
      const { userId, planId, sessionId } = data;

      const user = await this._userRepository.findById(userId);
      if (!user)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );

      const plan = await this._planRepository.findById(planId);
      if (!plan || !plan.stripePriceId)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );

      if (!user.stripeCustomerId) {
        const customerId = await this._stripeService.createCustomer(
          user.email,
          user.name,
          userId,
        );
        if (!customerId)
          throw new CustomError(
            CONSTANT_MESSAGES.BAD_REQUEST,
            STATUS_CODES.BAD_REQUEST,
          );
        user.stripeCustomerId = customerId;
        await user.save();
      }

      //if session already present expired it
      if (sessionId) {
        await this._stripeService.expireSession(sessionId);
      }

      //failed payment change plan , cancels the existing subscription
      const existingSubscription = await this._stripeService.getSubscription(
        user.stripeCustomerId,
      );
      console.log("subscription id", existingSubscription);
      if (existingSubscription) {
        await this._stripeService.cancelSubscription(existingSubscription.id);
        console.log("canceleed subscription");
      }

      const session = await this._stripeService.createCheckoutSession(
        user.stripeCustomerId,
        plan.stripePriceId,
        userId,
        planId,
      );

      return session;
    } catch (error) {
      console.log("payment checkout error", error);
      logger.error("Checkout service error", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(data: IVerifyPaymentDto): Promise<boolean> {
    try {
      const { sessionId } = data;

      const session = await this._stripeService.retriveSession(sessionId);
      if (session.status === "complete" || session.payment_status === "paid")
        return true;

      return false;
    } catch (error) {
      logger.error("Payment Verify Error", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async retryPayment(
    data: IRetryPaymentDto,
  ): Promise<IRetryPaymentResponseDto> {
    try {
      const { userId } = data;

      const user = await this._userRepository.findById(userId);
      if (!user || !user.stripeCustomerId)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );

      const invoice = await this._stripeService.getOpenInvoice(
        user.stripeCustomerId,
      );

      if (!invoice || !invoice.hosted_invoice_url) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      return {
        payment_url: invoice.hosted_invoice_url,
      };
    } catch (error) {
      logger.error("Retry Payment Error", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
