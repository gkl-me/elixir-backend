import { Response } from "express"

type TokenType = 'access'|'refresh'

export function setCookie(
    res:Response,
    type:TokenType,
    name:string,
    token:string
){
    const maxAge = type === 'access' ? (15 * 60 * 1000 ): ( 7 * 24 * 60 * 60 * 1000 )

    res.cookie(
        name,
        token,
        {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            maxAge,
            sameSite:'lax'
        }
    )
}

export function clearCookie(
    res:Response,
    name:string
){
    res.clearCookie(name)
}