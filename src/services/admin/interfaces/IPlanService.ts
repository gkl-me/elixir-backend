import { PlanResponseDto, updatePlanDto } from "../../../interfaces/dtos/admin/PlanDto";


export interface IPlanService{
    updatePlan:(updateData:updatePlanDto) => Promise<PlanResponseDto|null>
    findAllPlans:() => Promise<PlanResponseDto[]|null>
}