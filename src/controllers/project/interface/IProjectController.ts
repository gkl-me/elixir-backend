import { NextFunction, Request, Response } from "express";



export interface IProjectController {
    handleCreateProject(req: Request, res: Response, next: NextFunction): Promise<void>
    handleListProjects(req: Request, res: Response, next: NextFunction): Promise<void>
    handleGetProjectDetails(req: Request, res: Response, next: NextFunction): Promise<void>
}