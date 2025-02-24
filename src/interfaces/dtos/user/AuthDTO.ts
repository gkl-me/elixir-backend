import { IUserResponseDTO } from "./UserDTO"



export interface IUserRegisterDTO{
    name:string,
    email:string,
    password:string,
}


export interface IUserLoginDTO{
    email:string,
    password:string
}



export interface IUserAuthResponseDTO{
    accessToken:string,
    refreshToken:string,
    user:IUserResponseDTO
}