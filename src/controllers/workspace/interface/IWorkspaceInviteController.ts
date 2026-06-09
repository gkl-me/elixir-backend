import { NextFunction, Request, Response } from "express"




export interface IWorkspaceInviteController {
    handleListInvites(req: Request, res: Response, next: NextFunction): Promise<void>
    handleSendInvite(req: Request, res: Response, next: NextFunction): Promise<void>
    handleResendInvite(req: Request, res: Response, next: NextFunction): Promise<void>
    handleRevokeInvite(req: Request, res: Response, next: NextFunction): Promise<void>
    handleValidateInvite(req: Request, res: Response, next: NextFunction): Promise<void>
    handleAcceptInvite(req: Request, res: Response, next: NextFunction): Promise<void>
}