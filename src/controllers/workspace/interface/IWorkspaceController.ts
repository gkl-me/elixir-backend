import { NextFunction, Request, Response } from "express";

export interface IWorkspaceController {
  handleWorkspaceContext(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleWorkspaceLimits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handleListAllWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  handletoggleWorkspaceStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
