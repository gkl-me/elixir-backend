import { injectable } from "tsyringe";
import { ITokenManager } from "./interfaces/ITokenManager";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";
import logger from "../middlewares/logger";
import { AUTH_MESSAGES, CONSTANT_MESSAGES } from "../constants/messages";

@injectable()
export class TokenManager implements ITokenManager{

    private accessSecret
    private refreshSecret

    constructor(){
        const access = process.env.ACCESS_TOKEN_SECRET
        const refresh = process.env.REFRESH_TOKEN_SECRET
        if(!access){
            logger.error('Access token secret env is empty')
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        if(!refresh){
             logger.error('Refresh token secret env is empty')
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        this.accessSecret = access
        this.refreshSecret = refresh
    }

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
            const secret = type === 'access' ? this.accessSecret : this.refreshSecret
            const decoded  = jwt.verify(token, secret) as {id:string,role:string}
            return decoded
        }catch(error){
            logger.error(error)
            throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
    }
}