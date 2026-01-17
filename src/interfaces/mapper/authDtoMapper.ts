import { IUser } from "../../models/User";
import { IAuthResponseDto } from "../dtos/AuthDTO";

export class authDtoMapper{
    static toAuthResponse(user:IUser):IAuthResponseDto{
        return {
                id:String(user._id),
                name:user.name,
                email:user.email,
                role:user?.role
            }
    }
}

