import { NextFunction, Request, Response } from "express";

export interface ISubscriptionController {
  handleListAllSubcription(req: Request, res: Response, next: NextFunction): Promise<void>
  handleCancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void>
  handleReactivateSubscription(req: Request, res: Response, next: NextFunction): Promise<void>
}
