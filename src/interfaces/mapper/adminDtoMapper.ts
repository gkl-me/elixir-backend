import { IPlan } from "../../models/Plan";
import { PlanResponseDto } from "../dtos/admin/PlanDto";


export class adminDtoMapper{

    static toPlanResponseDto(plan:IPlan):PlanResponseDto{
        return {
            id:plan._id as string,
            name:plan.name,
            price:plan.price,
            limits:{
                maxProjects:plan.limits.maxProjects,
                maxTeams:plan.limits.maxTeams,
                maxUsersPerTeam:plan.limits.maxUsersPerTeam
            },
            isActive:plan.isActive,

        }
    }

}