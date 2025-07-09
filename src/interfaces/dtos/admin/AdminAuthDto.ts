
export interface AdminAuthDto{
    email:string
    password:string
}

export interface AdminAuthResponseDto extends AdminResponseDto{
    token:string,
}


export interface AdminResponseDto{
    id:string,
    name:string
    email:string
}
