import { PlanType } from "../../../models/Plan";
import {
  ISubscription,
  SUBSCRIPTION_STATUS,
} from "../../../models/Subscription";
import { IBaseRepository } from "../../base/interface/IBaseRepository";

export interface ISubscriptionRepository extends IBaseRepository<ISubscription> {
  getAllSubscriptions(
    data: IGetAllSubscription
  ): Promise<IGetAllSubscriptionRes>;
}

export interface IGetAllSubscription {
  search?: string;
  status?: string;
  plan?: string;
  skip: number;
  limit: number;
}

export interface IGetAllSubDetails {
  _id: string;
  workspaceName: string;
  ownerEmail: string;
  planType: PlanType;
  status: SUBSCRIPTION_STATUS;
  price: number;
  currentPeriodEnd: Date;
  currentPeriodStart: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

export interface IGetAllSubscriptionRes {
  subscriptions: IGetAllSubDetails[] | [];
  totalCount: number;
}
