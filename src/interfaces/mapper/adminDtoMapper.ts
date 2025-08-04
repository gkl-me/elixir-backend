import { IPlan } from "../../models/Plan";
import { IUser, User } from "../../models/User";
import { PlanResponseDto } from "../dtos/PlanDto";
import { UserListDto } from "../dtos/UserDTo";


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

    static toUserListDto(user:IUser):UserListDto{
        return {
            id:user._id as string,
            name:user.name,
            email:user.email,
            isBlocked:user.isBlocked
        }
    }

}