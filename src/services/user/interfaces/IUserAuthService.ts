import { CreatUserDTO, LoginDTO, RegisterDTO, UserLoginResponseDTO, UserRegisterResponseDTO, UserResponseDTO } from "../../../interfaces/dtos/UserDTO";
import { IUser } from "../../../models/User";

export interface IUserAuthService {
    registerUser(user:RegisterDTO): Promise<UserRegisterResponseDTO>
    loginUser(user:LoginDTO): Promise<UserLoginResponseDTO>
}