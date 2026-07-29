import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import {
  ICancelSubscriptionDto,
  ICreateSubscriptionDto,
  ICreateSubscriptionResDto,
  IListAllSubResDto,
  IListAllSubscriptionDto,
  IReactivateSubscriptionDto,
} from "../../interfaces/dtos/SubscriptionDto";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
import { logError } from "../../middlewares/loggerHelper";
import { CustomError } from "../../errors/CustomError";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IStripeService } from "../../providers/interfaces/IStripeService";
import { SubscriptionDtoMapper } from "../../interfaces/mapper/subscriptionDtoMapper";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(Token.SubscriptionRepository)
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @inject(Token.PlanRepository)
    private readonly _planRepository: IPlanRepository,
    @inject(Token.StripeService) private readonly _stripeService: IStripeService
  ) {}

  async createSubscription(
    data: ICreateSubscriptionDto
  ): Promise<ICreateSubscriptionResDto> {
    try {
      const {
        userId,
        planId,
        stripePriceId,
        stripeSubscriptionId,
        stripeCustomerId,
        workspaceId,
        currentPeriodEnd,
        currentPeriodStart,
      } = data;

      const now = new Date();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const plan = await this._planRepository.findById(planId);

      const sub = await this._subscriptionRepository.create({
        userId,
        workspaceId,
        stripeSubscriptionId,
        stripePriceId,
        stripeCustomerId,
        planId,
        planType: plan?.type,
        price: plan?.price,
        status: "active",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: currentPeriodEnd ?? endDate,
        currentPeriodStart: currentPeriodStart ?? now,
      });

      return {
        subscriptionId: String(sub._id),
      };
    } catch (error) {
      throw error;
    }
  }

  async cancelSubscription(data: ICancelSubscriptionDto): Promise<void> {
    try {
      const { subscriptionId, cancelMode } = data;

      const sub = await this._subscriptionRepository.findById(subscriptionId);

      if (!sub) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const isFree = sub.planType === "Free" || sub.price === 0;

      if (isFree) {
        if (cancelMode == "immediate") {
          ((sub.status = "canceled"), (sub.cancelAtPeriodEnd = true));
        } else {
          ((sub.status = "active"), (sub.cancelAtPeriodEnd = true));
        }
        await sub.save();
        return;
      }

      if (sub.stripeSubscriptionId) {
        if (cancelMode === "immediate") {
          //cancel the subscription
          await this._stripeService.cancelSubscription(
            sub.stripeSubscriptionId
          );
          sub.status = "canceled";
          sub.cancelAtPeriodEnd = true;
        } else {
          await this._stripeService.updateSubscription(
            sub.stripeSubscriptionId,
            true
          );

          sub.cancelAtPeriodEnd = true;
        }
        await sub.save();
        return;
      }
    } catch (error) {
      logError(error, {
        service: "SubscriptionService.cancelSubscription",
      });
      throw Error;
    }
  }

  async reactivateSubscription(
    data: IReactivateSubscriptionDto
  ): Promise<void> {
    try {
      const { subscriptionId } = data;

      const sub = await this._subscriptionRepository.findById(subscriptionId);
      if (!sub) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const isFree = sub.planType === "Free" || sub.price === 0;
      if (isFree) {
        sub.status = "active";
        sub.cancelAtPeriodEnd = false;
        await sub.save();
        return;
      }

      if (
        sub.status === "active" &&
        sub.cancelAtPeriodEnd &&
        sub.stripeSubscriptionId
      ) {
        await this._stripeService.updateSubscription(
          sub.stripeSubscriptionId,
          false
        );

        sub.cancelAtPeriodEnd = false;
        await sub.save();
        return;
      }

      if (sub.status === "canceled" && !isFree) {
        throw new CustomError(
          "Paid Subscription cannot be reactivated",
          STATUS_CODES.BAD_REQUEST
        );
      }
    } catch (error) {
      logError(error, {
        service: "SubscriptionService.reactivateSubscription",
      });
      throw error;
    }
  }

  async listAllSubscription(
    data: IListAllSubscriptionDto
  ): Promise<IListAllSubResDto> {
    try {
      const { search, page, limit, status, plan } = data;

      const skip = (page - 1) * limit;

      const { subscriptions, totalCount } =
        await this._subscriptionRepository.getAllSubscriptions({
          search,
          skip,
          limit,
          status,
          plan,
        });

      return {
        subscriptions: subscriptions.map((sub) =>
          SubscriptionDtoMapper.toSubscrpitonList(sub)
        ),
        totalCount,
      };
    } catch (error) {
      logError(error, {
        service: "subscriptionService.listAllSubscription",
      });
      throw error;
    }
  }
}
