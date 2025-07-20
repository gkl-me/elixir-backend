import { inject, injectable } from "tsyringe";
import { IPlanService } from "./interfaces/IPlanService";
import { Token } from "../../di/token";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
import { updatePlanDto } from "../../interfaces/dtos/PlanDto";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import { UpdatePlanSchema } from "../../validator/PlanSchema";
import { IStripeService } from "../../utils/interfaces/IStripeService";
import { adminDtoMapper } from "../../interfaces/mapper/adminDtoMapper";
import { CONSTANT_MESSAGES, PLAN_MESSAGES } from "../../constants/messages";

@injectable()
export class PlanService implements IPlanService{
    constructor(
        @inject(Token.PlanRepository) private _planRepository:IPlanRepository,
        @inject(Token.StripeService) private _stripeService:IStripeService
    ){}

    async updatePlan(updateData:updatePlanDto){
        try {
            const {id,data} = updateData

            
            const existingPlan = await this._planRepository.findById(id)
            if(!existingPlan){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            //validate update data
            const validateData = UpdatePlanSchema.safeParse(data)
            if(!validateData.success){
                throw new CustomError(validateData.error.errors[0].message,STATUS_CODES.BAD_REQUEST)
            }
            
            //update the value of price to cents
            if(existingPlan.name!=='Free' && data.price &&  existingPlan.price !== data.price){
                data.price = Number(data.price) * 100
                const priceId = await this._stripeService.createPrice(existingPlan.stripeProductId!,data.price)
                data.stripePriceId = priceId
            }


            //update the db 
            const updatedPlan = await this._planRepository.update(id,data)
            if(!updatedPlan){
                throw new CustomError(PLAN_MESSAGES.UPDATE_ERROR,STATUS_CODES.BAD_REQUEST)
            }

            return adminDtoMapper.toPlanResponseDto(updatedPlan)

        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllPlans(){
        try {
            const allPlans = await this._planRepository.findAll({},{sort:{"createdAt":1},})
            let plans = null;

            if(allPlans){
                plans = allPlans.map(plan => adminDtoMapper.toPlanResponseDto(plan))
            }

            return plans
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}