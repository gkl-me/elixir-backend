import { IUserAuthResponseDTO, IUserLoginDTO, IUserRegisterDTO } from "../../../interfaces/dtos/user/AuthDTO";
import { IUserResponseDTO } from "../../../interfaces/dtos/user/UserDTO";

export interface IUserAuthService {
    registerUser(user:IUserRegisterDTO): Promise<IUserResponseDTO>
    loginUser(user:IUserLoginDTO): Promise<IUserAuthResponseDTO>
}