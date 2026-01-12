
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
    id:string,
    email:string,
    name:string,
    role:string
}


export interface IVerifyEmailDTO{
    email:string,
    userId:string
}

export interface IVerifyDTO{
    token:string|undefined
}

export interface IGoogleAuthDto{
    name:string,
    email:string,
    googleId:string,
    image:string
}


export interface IRefreshTokenDto{
    refreshToken:string
}

export interface IRefreshTokenResponseDto{
    accessToken:string
}


export interface ILogoutDto{
    accessToken:string,
    refreshToken:string
}