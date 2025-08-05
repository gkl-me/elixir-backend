import { NextFunction, Request, Response } from "express";


export interface ISubscriptionController{
    create(req: Request,res: Response,next: NextFunction):Promise<void>
    find(req: Request,res: Response,next: NextFunction):Promise<void>
}