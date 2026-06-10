import { NextFunction, Request, Response } from "express";




export interface IWorkspaceTeamController {
    handleListTeams: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handleCreateTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handleAddMembers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handleRemoveMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    handleGetTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}