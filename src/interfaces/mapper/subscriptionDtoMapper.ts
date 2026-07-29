import { IGetAllSubDetails } from "../../repositories/subscription/interface/ISubscriptionRepository";
import {
  IListAllSubResDto,
  IListAllSubscriptionDetailsDto,
} from "../dtos/SubscriptionDto";

export class SubscriptionDtoMapper {
  static toSubscrpitonList(
    subscription: IGetAllSubDetails
  ): IListAllSubscriptionDetailsDto {
    return {
      id: String(subscription._id),
      workspaceName: subscription.workspaceName,
      ownerEmail: subscription.ownerEmail,
      planType: subscription.planType,
      status: subscription.status,
      price: subscription.price,
      currentPeriodEnd: subscription.currentPeriodEnd,
      currentPeriodStart: subscription.currentPeriodStart,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      createdAt: subscription.createdAt,
    };
  }
}
