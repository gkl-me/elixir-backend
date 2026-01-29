import { NextFunction, Request, Response } from "express";



export interface IOtpController{
    handleResendOtp(req:Request,res:Response,next:NextFunction):Promise<void>
    handleVerifyOtp(req:Request,res:Response,next:NextFunction):Promise<void>
}

