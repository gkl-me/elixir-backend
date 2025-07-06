import { NextFunction, Request, Response } from "express"



export interface IPlanController{
    updatePlan(req:Request,res:Response,next:NextFunction):Promise<void>,
    findAllPlans(req:Request,res:Response,next:NextFunction):Promise<void>
}