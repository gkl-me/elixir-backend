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
  workspaceId:string
}


export interface IGetBillingResDto{
  currentPlan: {
    id:string,
    name:string,
    type:string,
    price:number,
  },
  subscription:{
    status:string,
    currentPeriodEnd?:Date
  },
  upgradePlans:IPlan[] | undefined
}


