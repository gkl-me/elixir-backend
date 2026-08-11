import { Request, Response, NextFunction } from "express";
import { IPaymentController } from "./interface/IPaymentController";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IPaymentService } from "../../services/payment/interface/IPaymentService";
import { IOnboardingService } from "../../services/onboarding/interface/IOnboardingService";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringQueryParams } from "../../helper/queryParamUtils";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { date } from "zod";

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
        workspaceSlug,
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

  async handleBillingInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, ["workspaceId"]);
      const workspaceId = params?.workspaceId || "";

      const data = await this._paymentService.billingInfo({
        workspaceId,
      });

      successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, data);
    } catch (error) {
      next(error);
    }
  }

  async handleCreateCustomerPortal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const { workspaceId } = req.body;

      const result = await this._paymentService.createCustomerPortal({
        userId,
        workspaceId,
      });
      successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, result);
    } catch (error) {
      next(error);
    }
  }

  async handleStartUpgradeCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const userId = req.user.userId;
      const { workspaceId, planId, company } = req.body;
      const workspaceSlug = req.workspace?.workspaceSlug || "";

      console.log("Plan Id for upgrading", workspaceSlug);

      const result = await this._paymentService.startUpgradeCheckout({
        workspaceId,
        workspaceSlug,
        planId,
        company,
        userId,
      });

      successResponse(res, "Checkout Session created successfully", STATUS_CODES.OK, result)

    } catch (error) {
      next(error)
    }
  }
}
