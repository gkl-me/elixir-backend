import { NextFunction, Request, Response } from "express";


export interface IPlanController{
    getAvailablePlans(req:Request,res:Response,next:NextFunction):Promise<void>
    updatePlan(req:Request,res:Response,next:NextFunction):Promise<void>,
    findAllPlans(req:Request,res:Response,next:NextFunction):Promise<void>
}