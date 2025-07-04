import { injectable } from "tsyringe";
import { ITokenManager } from "./interfaces/ITokenManager";
import jwt from "jsonwebtoken";

@injectable()
export class TokenManager implements ITokenManager{
    generateAccessToken(id:string,role:string): string {
        const accessRoken = jwt.sign({id,role},process.env.ACCESS_TOKEN_SECRET!,{expiresIn:'15m'})
        return accessRoken
    }

    generateRefreshToken(id: string, role: string): string {
        const refreshToken = jwt.sign({id,role},process.env.REFRESH_TOKEN_SECRET!,{expiresIn:'24h'})
        return refreshToken
    }

    verifyToken(token: string, type:'access'|'refresh'): {id:string,role:string} {
        try{
            const secret = type === 'access' ? process.env.ACCESS_TOKEN_SECRET! : process.env.REFRESH_TOKEN_SECRET!
            const decoded  = jwt.verify(token, secret) as {id:string,role:string}
            return decoded
        }catch(error){
            throw new Error('Invalid token')
        }
    }
}