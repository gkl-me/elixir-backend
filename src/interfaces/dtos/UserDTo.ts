

export interface UserListDto{
    id:string,
    name:string,
    email:string,
    isBlocked:boolean,
}


export interface IGetAllUsersDto{
    search:string,
    sortBy:string
    sortOrder:number,
    status:string,
    page:number,
    limit:number
}