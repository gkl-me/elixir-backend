import { IGetOnboardingDto, IResponeOnboardingDto } from "../../../interfaces/dtos/OnboardingDto";


export interface IOnboardingService {
    getUserOnboarding(data:IGetOnboardingDto):Promise<IResponeOnboardingDto>
}