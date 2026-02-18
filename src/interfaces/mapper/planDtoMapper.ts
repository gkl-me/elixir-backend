import { IPlan } from "../../models/Plan";
import { PlanResponseDto } from "../dtos/PlanDto";



export class planDtoMapper{
    static toPlanResponse(plan:IPlan):PlanResponseDto{
        return {
            id:String(plan._id),
            name:plan.name,
            type:plan.type,
            price:plan.price,
            limits:{
                projects:plan.limits.projects,
                teams:plan.limits.teams,
                members:plan.limits.members,
                customRoles:plan.limits.customRoles,
                storageBytes:plan.limits.storageBytes
            },
            features:{
                githubAutomation:plan.features.githubAutomation,
                automationScripts:plan.features.automationScripts
            },
            isActive:plan.isActive
        }
    }
}