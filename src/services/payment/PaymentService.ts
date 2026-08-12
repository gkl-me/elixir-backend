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
  ICreateCustomerPortalDto,
  ICreateCustomerPortalResDto,
  IGetBillingDto,
  IGetBillingResDto,
  IRetryPaymentDto,
  IRetryPaymentResponseDto,
  IUpgradeCheckoutDto,
  IUpgradeCheckoutResDto,
  IVerifyPaymentDto,
} from "../../interfaces/dtos/PaymentDto";
import { logError } from "../../middlewares/loggerHelper";
import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";
import { ENV } from "../../constants/env";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(Token.StripeService)
    private readonly _stripeService: IStripeService,
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(Token.PlanRepository)
    private readonly _planRepository: IPlanRepository,
    @inject(Token.SubscriptionRepository)
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @inject(Token.WorkspaceRepository)
    private readonly _workspaceRepository: IWorkspaceRepository
  ) {}

  async startCheckout(data: ICheckoutDto): Promise<ICheckoutResponseDto> {
    try {
      const { userId, planId, sessionId } = data;

      const user = await this._userRepository.findById(userId);
      if (!user)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );

      const plan = await this._planRepository.findById(planId);
      if (!plan || !plan.stripePriceId)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );

      if (!user.stripeCustomerId) {
        const customerId = await this._stripeService.createCustomer(
          user.email,
          user.name,
          userId
        );
        if (!customerId)
          throw new CustomError(
            CONSTANT_MESSAGES.BAD_REQUEST,
            STATUS_CODES.BAD_REQUEST
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
        user.stripeCustomerId
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
        planId
      );

      return session;
    } catch (error) {
      console.log("payment checkout error", error);
      logger.error("Checkout service error", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async startUpgradeCheckout(
    data: IUpgradeCheckoutDto
  ): Promise<IUpgradeCheckoutResDto> {
    try {
      const { userId, workspaceId, planId, company } = data;

      console.log("data", data);

      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      //new  plan id to upgrade
      const newPlan = await this._planRepository.findById(planId);
      if (!newPlan || !newPlan.stripePriceId) {
        throw new CustomError(
          "Target plan not found or missing price ID",
          STATUS_CODES.BAD_REQUEST
        );
      }

      //check if stripe customerId exist
      if (!user.stripeCustomerId) {
        const customerId = await this._stripeService.createCustomer(
          user.email,
          user.name,
          userId
        );
        if (!customerId) {
          throw new CustomError(
            CONSTANT_MESSAGES.BAD_REQUEST,
            STATUS_CODES.BAD_REQUEST
          );
        }
        user.stripeCustomerId = customerId;
        await user.save();
      }

      const currentSub = await this._subscriptionRepository.findOne({
        workspaceId,
        status: "active",
      });

      const oldSubscriptionId = currentSub?.stripeSubscriptionId || "";

      const workspace = await this._workspaceRepository.findById(workspaceId);

      if (!workspace) {
        throw new CustomError("Workspace not found", STATUS_CODES.BAD_REQUEST);
      }

      // create upgrade session
      const session = await this._stripeService.createUpgradeCheckoutSession(
        user.stripeCustomerId,
        newPlan.stripePriceId,
        userId,
        planId,
        workspaceId,
        workspace.slug,
        oldSubscriptionId,
        company
      );

      return session;
    } catch (error) {
      logError(error, {
        service: "PaymentService.startUpgradeCheckout",
      });
      throw error;
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
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async retryPayment(
    data: IRetryPaymentDto
  ): Promise<IRetryPaymentResponseDto> {
    try {
      const { userId } = data;

      const user = await this._userRepository.findById(userId);
      if (!user || !user.stripeCustomerId)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );

      const invoice = await this._stripeService.getOpenInvoice(
        user.stripeCustomerId
      );

      if (!invoice || !invoice.hosted_invoice_url) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      return {
        payment_url: invoice.hosted_invoice_url,
      };
    } catch (error) {
      logger.error("Retry Payment Error", error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async billingInfo(data: IGetBillingDto): Promise<IGetBillingResDto> {
    try {
      const { workspaceId } = data;

      console.log("workspaceId", workspaceId);

      type PlanType = "free" | "pro" | "enterprice";

      const planOrder: Record<PlanType, number> = {
        free: 1,
        pro: 2,
        enterprice: 3,
      };

      const subscription = await this._subscriptionRepository.findOne({
        workspaceId,
        status: "active",
      });

      if (!subscription || !subscription.planId) {
        console.log("Subscription not found");
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const currentPlan = await this._planRepository.findById(
        subscription.planId
      );

      if (!currentPlan) {
        console.log("current plan");
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const allPlans = await this._planRepository.findAll({
        isActive: true,
      });

      const upgradePlans = allPlans?.filter((p) => {
        const planType = p.type.toLowerCase() as PlanType;
        const currentType = currentPlan.type.toLowerCase() as PlanType;

        return planOrder[planType] > planOrder[currentType];
      });

      return {
        currentPlan: {
          id: String(currentPlan._id),
          name: currentPlan.name,
          price: currentPlan.price,
          type: currentPlan.type,
        },
        subscription: {
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
        },
        upgradePlans:
          upgradePlans?.map((plan) => ({
            id: String(plan._id),
            name: plan.name,
            price: plan.price,
            type: plan.type,
            features: plan.features,
            limits: plan.limits,
            isActive: plan.isActive,
          })) ?? [],
      };
    } catch (error) {
      logError(error, {
        service: "PaymentService.billingInfo",
      });
      throw error;
    }
  }

  async createCustomerPortal(
    data: ICreateCustomerPortalDto
  ): Promise<ICreateCustomerPortalResDto> {
    try {
      const { userId, workspaceId } = data;

      const user = await this._userRepository.findById(userId);
      if (!user || !user.stripeCustomerId) {
        throw new CustomError(
          "Stripe customer not found",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const returnUrl = `${ENV.CLIENT_URL}/workspace/${workspaceId}/settings/?tab=billing`;
      const portalUrl = await this._stripeService.createCustomerPortalSession(
        user.stripeCustomerId,
        returnUrl
      );

      return { customerPortalUrl: portalUrl };
    } catch (error) {
      logError(error, {
        service: "PaymentService.creatCustomerPortal",
      });
      throw error;
    }
  }
}
