
export interface IRegisterDTO{
    name:string,
    email:string,
    password:string,
}


export interface ILoginDTO{
    email:string,
    password:string
}



export interface IAuthResponseDTO{
    accessToken:string,
    refreshToken:string,
    id:string,
    email:string,
    name:string,
}


export interface IVerifyEmailDTO{
    email:string,
    userId:string
}

export interface IVerifyDTO{
    token:string|undefined
}