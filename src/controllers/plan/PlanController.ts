import { inject, injectable } from "tsyringe"
import { IPlanController } from "./interface/IPlanController"
import { IPlanService } from "../../services/plan/interfaces/IPlanService"
import { Token } from "../../di/token"
import { NextFunction, Request, Response } from "express"
import { successResponse } from "../../helper/responseHanlder"
import { PLAN_MESSAGES } from "../../constants/messages"
import { STATUS_CODES } from "../../constants/statusCodes"

@injectable()
export class PlanController implements IPlanController{
    constructor(
        @inject(Token.PlanService) private _planService:IPlanService
    ){}

    async updatePlan(req: Request, res: Response, next: NextFunction){
        try {
            
            const {id} = req.params
            const data = req.body

            const updatedPlan = await this._planService.updatePlan({id,data})

            successResponse(res,PLAN_MESSAGES.UPDATE_SUCCESS,STATUS_CODES.OK,updatedPlan)
        } catch (error) {
            next(error)
        }
    }

    async findAllPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const allPlans = await this._planService.findAllPlans()
            successResponse(res,PLAN_MESSAGES.FETCH_SUCCESS,STATUS_CODES.OK,allPlans)
        } catch (error) {
            next(error)
        }
    }

    async getAvailablePlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const availablePlans = await this._planService.getAvailablePlans()
            successResponse(res,PLAN_MESSAGES.FETCH_SUCCESS,STATUS_CODES.OK,availablePlans)
        } catch (error) {
            next(error)
        }
    }
}