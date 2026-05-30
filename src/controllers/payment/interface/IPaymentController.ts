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
}
