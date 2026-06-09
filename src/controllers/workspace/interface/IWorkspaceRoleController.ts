import { NextFunction, Request, Response } from "express";



export interface IWorkspaceRoleController {
    handleGetRoles(req: Request, res: Response, next: NextFunction): Promise<void>
    handleCreateRole(req: Request, res: Response, next: NextFunction): Promise<void>
    handleUpdateRole(req: Request, res: Response, next: NextFunction): Promise<void>
    handleDeleteRole(req: Request, res: Response, next: NextFunction): Promise<void>
}