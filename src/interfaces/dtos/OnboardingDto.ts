export interface IGetOnboardingDto {
  userId: string;
}

type PlanType = "Free" | "Pro" | "Enterprice";

export interface IResponeOnboardingDto {
  userId: string;
  currentStep: number;
  isCompleted: boolean;

  paymentStatus: "pending" | "incomplete" | "failed" | "success";

  planType: PlanType;
  planId: string;
  planPrice: number;

  workspaceName?: string;

  company?: {
    name: string;
    type: string;
    email: string;
    phone: string;
    size: number;
  };
}

export interface ISaveOnboardingStepDto {
  userId: string;
  currentStep?: number;
  planType?: PlanType;
  planId?: string;
  planPrice?: number;
  workspaceName?: string;
  company?: {
    name: string;
    type: string;
    email: string;
    phone: string;
    size: number;
  };
}

export interface ICompleteOnboardingDto {
  userId: string;
}

export interface ICompleteOnboardingResDto {
  payment_url?: string;
}

export interface ICompleteOnboardingPaymentDto {
  userId: string;
}

export interface ICompleteOnboardingPaymentResDto {
  payment_url?: string;
}

export interface IChangePlanDto {
  userId: string;
}

export interface IVerifyPaymentStatusDto {
  userId: string;
}

export interface IVerifyPaymentStatusResDto {
  paymentStatus: "pending" | "failed" | "incomplete" | "success";
  workspaceSlug: string;
}
