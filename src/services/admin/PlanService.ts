import { inject, injectable } from "tsyringe";
import { IPlanService } from "./interfaces/IPlanService";
import { Token } from "../../di/token";
import { IPlanRepository } from "../../repositories/admin/interfaces/IPlanRepository";
import { updatePlanDto } from "../../interfaces/dtos/admin/PlanDto";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import { UpdatePlanSchema } from "../../validator/admin/PlanSchema";
import { IStripeService } from "../../utils/interfaces/IStripeService";
import { adminDtoMapper } from "../../interfaces/mapper/adminDtoMapper";

@injectable()
export class PlanService implements IPlanService{
    constructor(
        @inject(Token.PlanRepository) private planRepository:IPlanRepository,
        @inject(Token.StripeService) private stripeService:IStripeService
    ){}

    async updatePlan(updateData:updatePlanDto){
        try {
            const {id,data} = updateData

            
            const existingPlan = await this.planRepository.findById(id)
            if(!existingPlan){
                throw new CustomError('Unable to proccess the request',STATUS_CODES.BAD_REQUEST)
            }

            //validate update data
            const validateData = UpdatePlanSchema.safeParse(data)
            if(!validateData.success){
                throw new CustomError(validateData.error.errors[0].message,STATUS_CODES.BAD_REQUEST)
            }
            
            //update the value of price to cents
            if(existingPlan.name!=='Free' && data.price &&  existingPlan.price !== data.price){
                data.price = Number(data.price) * 100
                const priceId = await this.stripeService.createPrice(existingPlan.stripeProductId!,data.price)
                data.stripePriceId = priceId
            }


            //update the db 
            const updatedPlan = await this.planRepository.update(id,data)
            if(!updatedPlan){
                throw new CustomError('Failed to update plan data',STATUS_CODES.BAD_REQUEST)
            }

            return adminDtoMapper.toPlanResponseDto(updatedPlan)

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message,error.statusCode)
            }
            throw new CustomError('Failed to update plan',STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findAllPlans(){
        try {
            const allPlans = await this.planRepository.findAll({})
            let plans = null;
            if(allPlans){
                plans = allPlans.map(plan => adminDtoMapper.toPlanResponseDto(plan))
            }
            return plans
        } catch (error) {
            throw new CustomError('Failed to get all plan',STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}