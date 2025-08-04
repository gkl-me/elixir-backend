
import { IUser } from "../../../models/User"; 
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser>{
    findByEmail(email:string):Promise<IUser |null>
    findAllUsers(
        {search,status}:{
        search:string,
        status:string
        },
        options?:{
        sort?:Record<string,1|-1>,
        limit?:number,
        skip?:number
    }):Promise<IUser[]| null>
    findUsersCount():Promise<number>;
}

