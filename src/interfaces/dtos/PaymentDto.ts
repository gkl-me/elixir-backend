import { IPlan } from "../../models/Plan";
import { PlanResponseDto } from "./PlanDto";

export interface ICheckoutDto {
  userId: string;
  planId: string;
  sessionId: string;
}

export interface ICheckoutResponseDto {
  sessionId: string;
  payment_url: string;
}

export interface IVerifyPaymentDto {
  sessionId: string;
}

export interface IRetryPaymentDto {
  userId: string;
}

export interface IRetryPaymentResponseDto {
  payment_url: string;
}

export interface IGetBillingDto {
  workspaceId: string;
}

export interface IGetBillingResDto {
  currentPlan: {
    id: string;
    name: string;
    type: string;
    price: number;
  };
  subscription: {
    status: string;
    currentPeriodEnd?: Date;
  };
  upgradePlans: PlanResponseDto[] | []
}

export interface ICreateCustomerPortalDto {
  userId: string;
  workspaceId: string;
}

export interface ICreateCustomerPortalResDto {
  customerPortalUrl: string;
}



export interface IUpgradeCheckoutDto {
  userId: string,
  workspaceId: string,
  workspaceSlug: string
  planId: string,
  company?: {
    name: string;
    type: string;
    email: string;
    phone: string;
    size: number;
  };
}


export interface IUpgradeCheckoutResDto {
  sessionId: string,
  payment_url: string
}


