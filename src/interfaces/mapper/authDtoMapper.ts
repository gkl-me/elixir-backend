import { IUser } from "../../models/User";
import { IAuthResponseDTO } from "../dtos/AuthDTO";

export class authDtoMapper{
    static toAuthResponse(user:IUser):IAuthResponseDTO{
        return {
                id:String(user._id),
                name:user.name,
                email:user.email,
                role:user?.role
            }
    }
}

