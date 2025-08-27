
export interface AdminAuthDto{
    email:string
    password:string
}

export interface AdminAuthResponseDto{
    id:string,
    name:string
    email:string
    token:string,
    adminRefresh:string
}


export interface AdminResponseDto{
    id:string,
    name:string
    email:string
}

export interface AdminRefreshTokenDto{
    adminRefresh:string
}

export interface AdminRefreshTokenResponseDto{
    token:string
}


