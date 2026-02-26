import { IChangePlanDto, ICompleteOnboardingDto, ICompleteOnboardingPaymentDto, ICompleteOnboardingPaymentResDto, ICompleteOnboardingResDto, IGetOnboardingDto, IResponeOnboardingDto, ISaveOnboardingStepDto, IVerifyPaymentStatusDto, IVerifyPaymentStatusResDto } from "../../../interfaces/dtos/OnboardingDto";


export interface IOnboardingService {
    getUserOnboarding(data:IGetOnboardingDto):Promise<IResponeOnboardingDto>
    saveOnboardingStep(data:ISaveOnboardingStepDto):Promise<IResponeOnboardingDto>
    completeOnboarding(data:ICompleteOnboardingDto):Promise<ICompleteOnboardingResDto>
    completeOnboardingPayment(data:ICompleteOnboardingPaymentDto):Promise<ICompleteOnboardingPaymentResDto>
    changePlan(data:IChangePlanDto):Promise<void>
    verifyPaymentStatus(data:IVerifyPaymentStatusDto):Promise<IVerifyPaymentStatusResDto>
}