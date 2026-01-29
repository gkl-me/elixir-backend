import {  IUpdatePasswordDto, IUserListDto, IUserQueryDto } from "../../../interfaces/dtos/UserDTo";




export interface IUserService{
    getAllUsers(data:IUserQueryDto):Promise<{users:IUserListDto[],totalCount:number}>;
    toggleBlockStatus(id:string):Promise<void>
    updatePassword(data:IUpdatePasswordDto):Promise<void>
}