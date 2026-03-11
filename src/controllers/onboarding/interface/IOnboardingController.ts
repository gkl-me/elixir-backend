import { NextFunction, Request, Response } from "express";



export interface IOnboardingController{
    handleGetUserOnboarding(req:Request,res:Response,next:NextFunction):Promise<void>
    handleSaveOnboardingStep(req:Request,res:Response,next:NextFunction):Promise<void>
    handleCompleteOnboarding(req:Request,res:Response,next:NextFunction):Promise<void>
    handleCompleteOnboardingPayment(req:Request,res:Response,next:NextFunction):Promise<void>
    handleChangePlan(req:Request,res:Response,next:NextFunction):Promise<void>
}