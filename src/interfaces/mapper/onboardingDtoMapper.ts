import { IOnboarding } from "../../models/Onboarding";
import { IResponeOnboardingDto } from "../dtos/OnboardingDto";





export class onboardingDtoMapper{
    static toOnboardingResponse(onboarding:IOnboarding):IResponeOnboardingDto{
        return {
            userId:onboarding.userId,
            planId:onboarding.planId,
            planType:onboarding.planType,
            planPrice:onboarding.planPrice,
            currentStep:onboarding.currentStep,
            isCompleted:onboarding.isCompleted,
            paymentStatus:onboarding.paymentStatus,
            company:onboarding.company,
            workspaceName:onboarding.workspaceName
        }
    }
}