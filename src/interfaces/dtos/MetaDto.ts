import { string } from "zod"


export interface ILoginMetaDto{
    userAgent?:string,
    ip?:string
}


export interface IVerifyMetaDto{
    userAgent?:string,
    ip?:string
}