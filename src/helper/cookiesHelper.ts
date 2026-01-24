import { Response } from "express"


export function setCookie(
    res:Response,
    name:string,
    token:string
){
    const maxAge =  7 * 24 * 60 * 60 * 1000 

    res.cookie(
        name,
        token,
        {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            maxAge,
            sameSite:'lax',
        }
    )
}

export function clearCookie(
    res:Response,
    name:string
){
    res.clearCookie(name)
}