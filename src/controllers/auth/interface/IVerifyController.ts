import { NextFunction, Request, Response } from "express";



export interface IVerifyController{
    handleVerifyEmail(req:Request,res:Response,next:NextFunction):Promise<void>
    handleResendVerifyEmail(req:Request,res:Response,next:NextFunction):Promise<void>
}