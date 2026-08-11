import { NextFunction, Request, Response } from "express";

export interface IPaymentController {
  handleVerifyPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleRetryPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleBillingInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleCreateCustomerPortal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleStartUpgradeCheckout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>
}
