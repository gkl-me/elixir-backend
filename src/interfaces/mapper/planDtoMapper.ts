import { IPlan } from "../../models/Plan";
import { PlanResponseDto } from "../dtos/PlanDto";



export class planDtoMapper{
    static toPlanReponse(plan:IPlan):Omit<PlanResponseDto,'isActive'>{
        return {
            id:plan._id as string,
            name:plan.name,
            price:plan.price,
            limits:{
                maxProjects:plan.limits.maxProjects,
                maxTeams:plan.limits.maxTeams,
                maxUsersPerTeam:plan.limits.maxUsersPerTeam
            },
        }
    }
}