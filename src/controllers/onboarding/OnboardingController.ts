import { inject, injectable } from "tsyringe";
import { IOnboardingController } from "./interface/IOnboardingController";
import { Token } from "../../di/token";
import { IOnboardingService } from "../../services/onboarding/interface/IOnboardingService";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { OnboardingStateSchema } from "../../validator/OnboardingSchema";
import { CustomError } from "../../errors/CustomError";

@injectable()
export class OnboardingController implements IOnboardingController {
  constructor(
    @inject(Token.OnboardingService)
    private readonly _onboardingService: IOnboardingService
  ) {}

  async handleGetUserOnboarding(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;

      const onboarding = await this._onboardingService.getUserOnboarding({
        userId,
      });

      successResponse(
        res,
        "Successfully fetched onboarding users",
        STATUS_CODES.OK,
        { onboarding }
      );
    } catch (error) {
      next(error);
    }
  }

  async handleSaveOnboardingStep(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user.userId;

      ///validate the onboadring data
      const validate = OnboardingStateSchema.safeParse(data);
      if (!validate.success) {
        const errorMessage = validate.error.errors[0].message;
        console.log("validate error", validate.error);
        throw new CustomError(errorMessage, STATUS_CODES.BAD_REQUEST);
      }

      const onboarding = await this._onboardingService.saveOnboardingStep({
        ...validate.data,
        userId,
      });

      successResponse(
        res,
        "Successfully step completed onboarding",
        STATUS_CODES.OK,
        { onboarding }
      );
    } catch (error) {
      next(error);
    }
  }

  async handleCompleteOnboarding(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;

      const { payment_url } = await this._onboardingService.completeOnboarding({
        userId,
      });

      successResponse(
        res,
        "Successfully step completed onboarding",
        STATUS_CODES.OK,
        {
          payment_url,
        }
      );
    } catch (error) {
      next(error);
    }
  }

  async handleCompleteOnboardingPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;

      const { payment_url } =
        await this._onboardingService.completeOnboardingPayment({ userId });

      successResponse(res, "Complete Onboarding payment", STATUS_CODES.OK, {
        payment_url,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleChangePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;

      await this._onboardingService.changePlan({ userId });

      successResponse(res, "ChangePlan for onboarding", STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }
}
