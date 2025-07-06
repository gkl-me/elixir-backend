import { inject, injectable } from "tsyringe";
import { IPlanController } from "./interface/IPlanController";
import { Token } from "../../di/token";
import { IPlanService } from "../../services/admin/interfaces/IPlanService";
import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";

@injectable()
export class PlanController implements IPlanController{
    constructor(
        @inject(Token.PlanService) private planService:IPlanService
    ){}

    async updatePlan(req: Request, res: Response, next: NextFunction){
        try {
            
            const {id} = req.params
            const data = req.body

            const updatedPlan = await this.planService.updatePlan({id,data})

            successResponse(res,"Plan successfully updated",STATUS_CODES.OK,updatedPlan)
        } catch (error) {
            next(error)
        }
    }

    async findAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const allPlans = await this.planService.findAllPlans()
            successResponse(res,"Fetched all plans",STATUS_CODES.OK,allPlans)
        } catch (error) {
            next(error)
        }
    }
}