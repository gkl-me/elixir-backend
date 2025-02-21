import { IUser } from "../../models/User"

export interface CreatUserDTO {
    name:string,
    email:string,
    password:string
}


export interface UpdateUserDTO{
    id:string
    name?:string,
    email?:string,
    password?:string,
}


export interface UserResponseDTO{
    id:string,
    name:string,
    email:string,
}


export interface LoginDTO{
    email:string,
    password:string
}

export interface RegisterDTO{
    name:string,
    email:string,
    password:string
}


export interface UserLoginResponseDTO{
    accessToken:string,
    refreshToken:string,
    user:IUser
}


export interface UserRegisterResponseDTO{
    user:UserResponseDTO
}



//user register , login , update details, 


//subscription 
