import { IUserResponseDTO } from "../../../interfaces/dtos/user/UserDTO";
import { IUser } from "../../../models/User";


export interface IAdminUserManagemetService{
    getAllUsers(): Promise<IUserResponseDTO[]|null>;
    blockUser(userId: string): Promise<IUserResponseDTO|null>
}