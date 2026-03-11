import { inject, injectable } from "tsyringe";
import { IOnboardingService } from "./interface/IOnboardingService";
import { IChangePlanDto, ICompleteOnboardingDto, ICompleteOnboardingPaymentDto, ICompleteOnboardingPaymentResDto, ICompleteOnboardingResDto, IGetOnboardingDto, IResponeOnboardingDto, ISaveOnboardingStepDto, IVerifyPaymentStatusDto, IVerifyPaymentStatusResDto } from "../../interfaces/dtos/OnboardingDto";
import { IOnboardingRepository } from "../../repositories/onboarding/interface/IOnboardingRepository";
import { Token } from "../../di/token";
import { onboardingDtoMapper } from "../../interfaces/mapper/onboardingDtoMapper";
import { CustomError } from "../../errors/CustomError";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IWorkspaceService } from "../workspace/interface/IWorkspaceService";
import { ISubscriptionService } from "../subscription/interface/ISubscriptionService";
import { IPaymentService } from "../payment/interface/IPaymentService";



@injectable()
export class OnboardingService implements IOnboardingService{

    constructor(
        @inject(Token.OnboardingRepository) private readonly _onboardingRepository:IOnboardingRepository,
        @inject(Token.WorkspaceService) private readonly _workspaceService:IWorkspaceService,
        @inject(Token.SubscriptionService) private readonly _subscriptionService:ISubscriptionService,
        @inject(Token.PaymentService) private readonly _paymentService:IPaymentService
    ){}

    async getUserOnboarding(data: IGetOnboardingDto): Promise<IResponeOnboardingDto> {
        try {
            
            const {userId} = data

            let onboarding = await this._onboardingRepository.findOne({userId})

            if(!onboarding){
                onboarding = await this._onboardingRepository.create({userId})
            }

            return onboardingDtoMapper.toOnboardingResponse(onboarding)

        } catch (error) {
            throw error
        }
    }

    async saveOnboardingStep(data:ISaveOnboardingStepDto):Promise<IResponeOnboardingDto>{
        try {
            
            const {userId,...payload} = data

            const onboarding = await this._onboardingRepository.findOne({userId})
            if(!onboarding){
                //onboarding not found
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            const updatedOnboarding = await this._onboardingRepository.update(String(onboarding._id),payload)      

            return onboardingDtoMapper.toOnboardingResponse(updatedOnboarding!)

        } catch (error) {
            throw error
        }
    }

    async completeOnboarding(data:ICompleteOnboardingDto):Promise<ICompleteOnboardingResDto>{

        try {
            
            const {userId} = data

            const onboarding = await this._onboardingRepository.findOne({userId})

            if(!onboarding){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            if(onboarding.planType=='Free'){
                //create workspace 
                const workspace = await this._workspaceService.createWorkspace({
                    name:onboarding.workspaceName!,
                    userId,
                })

                //create subscription
                await this._subscriptionService.createSubscription({
                    userId,
                    planId:onboarding.planId,
                    workspaceId:String(workspace._id)
                })
            }

            //save onboarding details indb
            onboarding.isCompleted = true
            onboarding.paymentStatus = "success"
            onboarding.currentStep = 3

            
            if(onboarding.planType!=="Free"){
                const session = await this._paymentService.startCheckout({
                    userId,
                    planId:onboarding.planId,
                    sessionId:onboarding.sessionId??""
                })
                onboarding.sessionId = session.sessionId
                onboarding.paymentStatus  = "pending"
                console.log("session",session)
                await onboarding.save()
                return {
                    payment_url:session.payment_url
                }
            }

            await onboarding.save()
            return{
                payment_url:""
            }

        } catch (error) {
            throw error
        }

    }
    async completeOnboardingPayment(data:ICompleteOnboardingPaymentDto):Promise<ICompleteOnboardingPaymentResDto>{
        try {
            
            const {userId} = data

            const onboarding = await this._onboardingRepository.findOne({userId})
            if(!onboarding){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            const session = await this._paymentService.startCheckout({
                userId,
                planId:onboarding.planId,
                sessionId:onboarding.sessionId??""
            })

            onboarding.sessionId = session.sessionId
            await onboarding.save()

            return {
                payment_url:session.payment_url??""
            }

        } catch (error) {
            throw error
        }
    }

    async changePlan(data:IChangePlanDto):Promise<void>{
        try {

            const {userId} = data

            const onboarding = await this._onboardingRepository.findOne({userId})
            if(!onboarding){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            onboarding.isCompleted = false
            onboarding.paymentStatus = 'pending'
            onboarding.currentStep = 1

            await onboarding.save()

        } catch (error) {
            throw error
        }
    }

    async verifyPaymentStatus(data: IVerifyPaymentStatusDto): Promise<IVerifyPaymentStatusResDto> {
        try {
            
            const {userId} = data

            const onboarding = await this._onboardingRepository.findOne({userId})
            if(!onboarding){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            const status = await this._paymentService.verifyPayment({sessionId:onboarding.sessionId??""})
            if(!status){
                onboarding.paymentStatus='incomplete'
                await onboarding.save()
            }

            return {
                paymentStatus:onboarding.paymentStatus
            }

        } catch (error) {
            throw error
        }
    }
}