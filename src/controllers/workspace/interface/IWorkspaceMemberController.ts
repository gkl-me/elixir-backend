import { NextFunction, Request, Response } from "express"



export interface IWorkspaceMemberController {
    handleListMembers(req: Request, res: Response, next: NextFunction): Promise<void>
    handleUpdateMemberRole(req: Request, res: Response, next: NextFunction): Promise<void>
    handleRemoveMember(req: Request, res: Response, next: NextFunction): Promise<void>
}