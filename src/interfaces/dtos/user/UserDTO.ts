

export interface ICreateUserDTO {
    name:string,
    email:string,
    password:string,
}


export interface IUpdateUserDTO{
    name?:string,
    email?:string,
    password?:string,
};


export interface IUserResponseDTO {
    id:string,
    name:string,
    email:string,
    isBlocked:boolean,
}