

export interface IUserListDto{
    id:string,
    name:string,
    email:string,
    isBlocked:boolean,
    avatarUrl?:string
}


export interface IUserQueryDto{
    search:string,
    sortBy:string
    sortOrder:number,
    status:string,
    page:number,
    limit:number
}


export interface IUpdatePasswordDto{
    newPassword:string,
    email:string
}


export interface IChangePasswordDto{
    userId:string
    currentPassword:string,
    newPassword:string
}