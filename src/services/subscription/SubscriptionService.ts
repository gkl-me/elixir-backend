// import { inject, injectable } from "tsyringe";
// import { Token } from "../../di/token";
// import { IStripeService } from "../../utils/interfaces/IStripeService";
// import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
// import { CustomError } from "../../errors/CustomError";
// import { CONSTANT_MESSAGES } from "../../constants/messages";
// import { STATUS_CODES } from "../../constants/statusCodes";
// import { ICheckoutCompleteDto, ICreateCheckoutDto, ICreateCheckoutResponseDto, ICreateStripCustomerDto, ICreateStripeCustomerResponseDto, ICreateSubscriptionDto, ICreateSubscriptionResponseDto, IfindUserSubscriptionDto, IfindUserSubscriptionResponseDto, IHandlePaymentFailureDto, IHandlePaymentSuccessDto } from "../../interfaces/dtos/SubscriptionDto";
// import { ISubscriptionService } from "./interface/ISubscriptionService";
// import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
// import logger from "../../middlewares/logger";
// import { PlanType } from "../../models/Plan";
// import { SUBSCRIBTION_STATUS } from "../../models/Subscription";
// import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";




// @injectable()
// export class SubscriptionService implements ISubscriptionService{
//     constructor(
//         @inject(Token.StripeService) private _stripeService:IStripeService,
//         @inject(Token.UserRepository) private _userRepository:IUserRepository,
//         @inject(Token.PlanRepository) private _planRepository:IPlanRepository,
//         @inject(Token.SubscriptionRepository) private _subscriptionRepository:ISubscriptionRepository
//     ){}

//     async createCheckout(data:ICreateCheckoutDto):Promise<ICreateCheckoutResponseDto> {
//         try {
            
//             const {stripePriceId,stripeCustomerId,userId,planId} = data

//             const checkoutSession = await this._stripeService.createCheckoutSession(stripeCustomerId,stripePriceId,userId,planId)

//             return {
//                 ...checkoutSession
//             }

//         } catch (error) {
//             logger.error("Failed to create checkout service",error)
//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
//         }
//     }
    
//     async createSubscription(data: ICreateSubscriptionDto):Promise<ICreateSubscriptionResponseDto>{
//         try {

//             const {planId,userId} = data

//             // data also have company details inside it


//             //find priceId
//             const selectedPlan = await this._planRepository.findById(planId)
//             if(!selectedPlan) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//             //stripe customer id
//             const {stripeCustomerId} = await this.createStripeCustomer({userId})

//             if(selectedPlan.name==PlanType.Free){

//                 let subscription;

//                 const subscriptionExisits = await this._subscriptionRepository.findOne({
//                     userId,
//                 })

//                 if(!subscriptionExisits){
//                     subscription = await this._subscriptionRepository.create({
//                         userId,
//                         planId,
//                         status:SUBSCRIBTION_STATUS.ACTIVE,
//                         current_period_start:new Date(),
//                     })
//                 }else{
//                     subscriptionExisits.status = SUBSCRIBTION_STATUS.ACTIVE,
//                     subscriptionExisits.planId = planId,
//                     subscriptionExisits.current_period_start = new Date

//                     subscription = await subscriptionExisits.save()
//                 }
                
//                 return {
//                     subscriptionId:String(subscription._id),
//                     subscriptionStatus:subscription.status
//                 }
//             }

//             if(selectedPlan.name === PlanType.Enterprice || PlanType.Pro){

//                 if(!selectedPlan.stripePriceId) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//                 if(selectedPlan.name === PlanType.Enterprice){
//                     //save company details in redis 
//                 }

//                 //stripe checkout
//                 const  {sessionId,checkoutUrl} = await this.createCheckout({stripeCustomerId,stripePriceId:selectedPlan.stripePriceId,userId,planId})

//                 const subscriptionExisits = await this._subscriptionRepository.findOne({
//                     userId,
//                 })

//                  if(!subscriptionExisits){

//                     await this._subscriptionRepository.create({
//                          userId,
//                          planId,
//                          status:SUBSCRIBTION_STATUS.INCOMPLETE,
//                          current_period_start:new Date(),
//                     })  
//                 }else{
//                     subscriptionExisits.status = SUBSCRIBTION_STATUS.INCOMPLETE,
//                     subscriptionExisits.planId = planId,
//                     subscriptionExisits.current_period_start = new Date
//                     await subscriptionExisits.save()
//                 }
//                 return {
//                     sessionId,
//                     checkoutUrl
//                 }
//             }


//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
//         } catch (error) {
//             logger.error(error)
//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
//         }
//     }
    
//     async createStripeCustomer(data:ICreateStripCustomerDto):Promise<ICreateStripeCustomerResponseDto>{
//         try {
            
//             const{userId} = data

//             const userFound = await this._userRepository.findById(userId)
//             if(!userFound) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//             let stripeCustomerId = null;
//             if(!userFound.stripeCustomerId){

//                 stripeCustomerId = await this._stripeService.createCustomer(userFound.email,userFound.name)

//                 if(!stripeCustomerId) throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)

//                 userFound.stripeCustomerId = stripeCustomerId
//                 userFound.save()
//             }

//             return {
//                 stripeCustomerId:userFound.stripeCustomerId
//             }

//         } catch (error) {
//             logger.error(error)
//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
//         }
//     }

//     async findUserSubscription(data:IfindUserSubscriptionDto):Promise<null|IfindUserSubscriptionResponseDto>{
//         try {
            
//             const {userId} = data

//             const userFound = await this._userRepository.findById(userId)
//             if(!userFound) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//             const subscription = await this._subscriptionRepository.findOne({
//                 userId
//             })

//             if(!subscription){
//                 return null
//             }

//             return {
//                 subscriptionId:String(subscription._id),
//                 subscriptionStatus:subscription.status,
//                 invoiceUrl:subscription?.invoiceUrl || ""
//             }
            
//         } catch (error) {
//             logger.error(error)
//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)   
//         }
//     }

//     async handleCheckoutComplete(data:ICheckoutCompleteDto){
//         try {
            
//             const {metadata,stripeSubscriptionId} = data

//             if(!metadata || !metadata?.planId || !metadata?.planId || !stripeSubscriptionId) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//             const {userId,planId} = metadata

//             const subscription = await this._subscriptionRepository.findOne({
//                 userId,
//                 planId
//             })

//             if(!subscription) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//             subscription.stripeSubscriptionId = stripeSubscriptionId
//             subscription.status = SUBSCRIBTION_STATUS.PENDING
//             await subscription.save()

//         } catch (error) {
//             logger.error(error)
//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
//         }
//     }
    
//     async handleInvoicePaymentSuccess(data:IHandlePaymentSuccessDto){
//         try {
            
//             const {subId} = data

//             if(!subId) throw new CustomError("Subscribtion id not found ",STATUS_CODES.BAD_REQUEST)

//             const subscription = await this._subscriptionRepository.findOne({
//                 stripeSubscriptionId:subId
//             })

//             if(!subscription) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//             await this._subscriptionRepository.update(String(subscription._id),{
//                 status:SUBSCRIBTION_STATUS.ACTIVE
//             })

//         } catch (error) {
//             logger.error(error)
//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
//         }
//     }

//     async handleInvoicePaymentFailure(data:IHandlePaymentFailureDto){
//         try {

//             const {subId,invoiceUrl} = data

//             console.log(invoiceUrl)
//             console.log(subId)

//             if(!subId || !invoiceUrl) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//              const subscription = await this._subscriptionRepository.findOne({
//                 stripeSubscriptionId:subId
//              })

//             if(!subscription) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

//             subscription.invoiceUrl = invoiceUrl
//             subscription.status = SUBSCRIBTION_STATUS.INCOMPLETE
//             await subscription.save()
            
//         } catch (error) {
//             logger.error(error)
//             throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
//         }
//     }
// }