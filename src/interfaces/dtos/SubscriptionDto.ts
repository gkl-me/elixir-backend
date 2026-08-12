import { PlanType } from "../../models/Plan";
import { SUBSCRIPTION_STATUS } from "../../models/Subscription";

export interface ICreateSubscriptionDto {
  userId: string;
  planId: string;
  workspaceId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status?: SUBSCRIPTION_STATUS;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  stripeCustomerId?: string;
}

export interface ICreateSubscriptionResDto {
  subscriptionId: string;
}

export interface ICancelSubscriptionDto {
  subscriptionId: string;
  cancelMode: "period_end" | "immediate";
}

export interface IReactivateSubscriptionDto {
  subscriptionId: string;
}

export interface IListAllSubscriptionDto {
  search?: string;
  status?: string;
  plan?: string;
  page: number;
  limit: number;
}

export interface IListAllSubscriptionDetailsDto {
  id: string;
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

export interface IListAllSubResDto {
  subscriptions: IListAllSubscriptionDetailsDto[] | [];
  totalCount: number;
}
