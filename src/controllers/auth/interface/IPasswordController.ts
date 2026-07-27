import { NextFunction, Request, Response } from "express";

export interface IPasswordController {
  handleForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleResetPasswrod(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
