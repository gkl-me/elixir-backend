import { injectable } from "tsyringe";
import { BaseRepository } from "../base/BaseRepository";
import { IOnboarding, Onboarding } from "../../models/Onboarding";
import { IOnboardingRepository } from "./interface/IOnboardingRepository";

@injectable()
export class OnboardingRepository
  extends BaseRepository<IOnboarding>
  implements IOnboardingRepository
{
  constructor() {
    super(Onboarding);
  }
}
