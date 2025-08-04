import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    registerUser(req:Request,res:Response,next:NextFunction):Promise<void>,
    loginUser(req:Request,res:Response,next:NextFunction):Promise<void>
    verifyUser(req: Request, res: Response,next:NextFunction): Promise<void>
    googleAuth(req: Request, res: Response,next:NextFunction): Promise<void>
}