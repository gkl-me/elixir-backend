

export interface IAuthSession{
    userId:string,
    refreshTokenHash:string,
    tokenVersion:number,
    userAgent?:string,
    ip?:string,
    createdAt:number,
    expiresAt:number
}