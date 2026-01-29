import { IPlan } from "../../models/Plan";
import { IUser, User } from "../../models/User";
import { PlanResponseDto } from "../dtos/PlanDto";
import { IUserListDto } from "../dtos/UserDTo";



export class userDtoMapper{


    static toUserListDto(user:IUser):IUserListDto{
        return {
            id:user._id as string,
            name:user.name,
            email:user.email,
            isBlocked:user.isBlocked,
            avatarUrl:user?.avatarUrl
        }
    }

}