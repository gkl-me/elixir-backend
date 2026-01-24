

export interface IAuthSession{
    userId:string,
    refreshTokenHash:string,
    tokenVerson:number,
    userAgent?:string,
    ip?:string,
    createdAt:string,
    expiresAt:string
}