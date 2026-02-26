import { ICreatePlanDTo, ITogglePlanStatusDto, PlanResponseDto, updatePlanDto } from "../../../interfaces/dtos/PlanDto";


export interface IPlanService{
    createPlan(data:ICreatePlanDTo):Promise<PlanResponseDto|null>
    findAllPlans():Promise<PlanResponseDto[]|null>
    togglePlanStatus(data:ITogglePlanStatusDto):Promise<void>
}