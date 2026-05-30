import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import { ICreateSubscriptionDto } from "../../interfaces/dtos/SubscriptionDto";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(Token.SubscriptionRepository)
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @inject(Token.PlanRepository)
    private readonly _planRepository: IPlanRepository
  ) {}

  async createSubscription(data: ICreateSubscriptionDto): Promise<void> {
    try {
      const {
        userId,
        planId,
        stripePriceId,
        stripeSubscriptionId,
        workspaceId,
      } = data;

      const now = new Date();
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const plan = await this._planRepository.findById(planId);

      await this._subscriptionRepository.create({
        userId,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
        stripePriceId,
        stripeSubscriptionId,
        workspaceId,
        planId: String(plan?._id),
      });
    } catch (error) {
      throw error;
    }
  }
}
