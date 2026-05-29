import {  IChangePasswordDto, IListActiveSessionsDto, IListActiveSessionsResponseDto, IUpdatePasswordDto, IUpdateUserProfileDto, IUserListDto, IUserQueryDto } from "../../../interfaces/dtos/UserDTo";
import { IAuthSession } from "../../../interfaces/types/session.types";




export interface IUserService{
    getAllUsers(data:IUserQueryDto):Promise<{users:IUserListDto[],totalCount:number}>;
    toggleBlockStatus(id:string):Promise<void>
    updatePassword(data:IUpdatePasswordDto):Promise<void>
    changePassword(data:IChangePasswordDto):Promise<void>
    listActiveSessions(data:IListActiveSessionsDto):Promise<IListActiveSessionsResponseDto[]>
    updateProfile(data:IUpdateUserProfileDto):Promise<void>
    
}