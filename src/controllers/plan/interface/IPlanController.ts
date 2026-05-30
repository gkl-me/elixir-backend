import { NextFunction, Request, Response } from "express";

export interface IPlanController {
  handleCreatePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleFindAllPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleTogglePlanStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
