import { NextFunction, Request, Response } from "express";

export interface IWorkspaceController {
  handleWorkspaceContext(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
