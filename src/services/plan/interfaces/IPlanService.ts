import {
  ICreatePlanDTo,
  IGetPlanDto,
  ITogglePlanStatusDto,
  PlanResponseDto,
} from "../../../interfaces/dtos/PlanDto";

export interface IPlanService {
  createPlan(data: ICreatePlanDTo): Promise<PlanResponseDto | null>;
  findAllPlans(
    data: IGetPlanDto,
  ): Promise<{
    plans: PlanResponseDto[] | null;
    totalPage: number;
    currentPage: number;
  }>;
  togglePlanStatus(data: ITogglePlanStatusDto): Promise<void>;
}
