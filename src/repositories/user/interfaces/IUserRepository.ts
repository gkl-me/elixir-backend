
import { CreatUserDTO, UpdateUserDTO, UserResponseDTO } from "../../../interfaces/dtos/UserDTO";
import { IUser } from "../../../models/User"; 

export interface IUserRepository{
    findByEmail(email:string):Promise<IUser>
    findById(id:string):Promise<IUser>
    create(user:CreatUserDTO):Promise<UserResponseDTO>
    update(user:UpdateUserDTO):Promise<UserResponseDTO>
}

