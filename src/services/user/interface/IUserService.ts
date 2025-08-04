import { IGetAllUsersDto, UserListDto } from "../../../interfaces/dtos/UserDTo";




export interface IUserService{
    getAllUsers(data:IGetAllUsersDto):Promise<{users:UserListDto[],totalCount:number} |null>;
    toggleBlockStatus(id:string):Promise<void>
}