import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IStripeService } from "../../utils/interfaces/IStripeService";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { CustomError } from "../../errors/CustomError";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { custom } from "zod";
import { CreateCheckoutDto, CreateCheckoutResponseDto, SubscriptionDto, SubscriptionResponseDto } from "../../interfaces/dtos/SubscriptionDto";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
import logger from "../../middlewares/logger";





@injectable()
export class SubscriptionService implements ISubscriptionService{
    constructor(
        @inject(Token.StripeService) private _stripeService:IStripeService,
        @inject(Token.UserRepository) private _userRepository:IUserRepository,
        @inject(Token.PlanRepository) private _planRepository:IPlanRepository,
    ){}

    async createCheckout(data:CreateCheckoutDto):Promise<CreateCheckoutResponseDto> {
        try {
            
            const {planId,userId} = data

            const userFound = await this._userRepository.findById(userId)
            if(!userFound) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
                
        //find priceId
        const selectedPlan = await this._planRepository.findById(planId)
        if(!selectedPlan ||   !selectedPlan.stripePriceId) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

        // creating stripe customer id 
            let stripeCustomerId = null;
            if(!userFound.stripeCustomerId){

                stripeCustomerId = await this._stripeService.createCustomer(userFound.email,userFound.name)

                if(!stripeCustomerId) throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)

                userFound.stripeCustomerId = stripeCustomerId
                userFound.save()
            }

            const checkoutSession = await this._stripeService.createCheckoutSession(userFound.stripeCustomerId,selectedPlan.stripePriceId)

            return {
                ...checkoutSession
            }

        } catch (error) {
            logger.error("Failed to create checkout service",error)
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
    
}