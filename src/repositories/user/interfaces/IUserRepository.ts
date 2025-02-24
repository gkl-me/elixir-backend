
import { ICreateUserDTO, IUpdateUserDTO, IUserResponseDTO } from "../../../interfaces/dtos/user/UserDTO";
import { IUser } from "../../../models/User"; 
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser>{
    findByEmail(email:string):Promise<IUser |null>
}

