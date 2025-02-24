import { IUser } from "../../models/User";
import { IUserResponseDTO } from "../dtos/user/UserDTO";

export function userDtoMapper(user:IUser):IUserResponseDTO{
    return {
        id:user._id as string,
        name:user.name,
        email:user.email,
        isBlocked:user.isBlocked,
    }
}

