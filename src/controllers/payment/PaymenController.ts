import { Request, Response, NextFunction } from "express";
import { IPaymentController } from "./interface/IPaymentController";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IPaymentService } from "../../services/payment/interface/IPaymentService";
import { IOnboardingService } from "../../services/onboarding/interface/IOnboardingService";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(Token.PaymentService)
    private readonly _paymentService: IPaymentService,
    @inject(Token.OnboardingService)
    private readonly _onboardingService: IOnboardingService
  ) { }

  async handleVerifyPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;

      const { paymentStatus, workspaceSlug } =
        await this._onboardingService.verifyPaymentStatus({ userId });

      successResponse(res, "Payment Verify Status", STATUS_CODES.OK, {
        paymentStatus,
        workspaceSlug
      });
    } catch (error) {
      next(error);
    }
  }

  async handleRetryPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;

      const { payment_url } = await this._paymentService.retryPayment({
        userId,
      });

      successResponse(res, "Retry Payment again", STATUS_CODES.OK, {
        payment_url,
      });
    } catch (error) {
      next(error);
    }
  }
}
