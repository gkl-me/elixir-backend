import { NextFunction, Request, Response } from "express";

export interface IUserAuthController {
    registerUser(req:Request,res:Response,next:NextFunction):Promise<void>,
    loginUser(req:Request,res:Response,next:NextFunction):Promise<void>
}