import { NextFunction, Request, Response } from "express";

export interface IAdminAuthController{
    login(req: Request, res: Response,next:NextFunction): Promise<void>,
    me(req:Request,res:Response,next:NextFunction):Promise<void>,
    logout(req:Request,res:Response,next:NextFunction):Promise<void>
    refresh(req:Request,res:Response,next:NextFunction):Promise<void>
}