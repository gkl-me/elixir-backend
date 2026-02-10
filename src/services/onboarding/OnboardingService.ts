import { inject, injectable } from "tsyringe";
import { IOnboardingService } from "./interface/IOnboardingService";
import { IGetOnboardingDto, IResponeOnboardingDto } from "../../interfaces/dtos/OnboardingDto";
import { IOnboardingRepository } from "../../repositories/onboarding/interface/IOnboardingRepository";
import { Token } from "../../di/token";
import { onboardingDtoMapper } from "../../interfaces/mapper/onboardingDtoMapper";



@injectable()
export class OnboardingService implements IOnboardingService{

    constructor(
        @inject(Token.OnboardingRepository) private readonly _onboardingRepository:IOnboardingRepository
    ){}

    async getUserOnboarding(data: IGetOnboardingDto): Promise<IResponeOnboardingDto> {
        try {
            
            const {userId} = data

            let onboarding = await this._onboardingRepository.findOne({userId})

            if(!onboarding){
                onboarding = await this._onboardingRepository.create({userId})
            }

            return onboardingDtoMapper.toOnboardingResponse(onboarding)

        } catch (error) {
            throw error
        }
    }
}