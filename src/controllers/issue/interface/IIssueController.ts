import { NextFunction, Request, Response } from "express";

export interface IIssueController {
  handleCreateBacklogIssue(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleListBacklogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
