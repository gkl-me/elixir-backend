import { JwtPayload } from "jsonwebtoken";
import { IAccessTokenPayload, IRefreshTokenPayload } from "../../interfaces/types/jwt.types";

export interface ITokenManager {
    generateAccessToken(
        userId:string,
        role:string,
        sessionId:string
    ):string;
    generateRefreshToken(
        userId:string,
        role:string,
        sessionId:string,
        tokenVersion:number
    ):string;
    verifyToken(token:string,type:'access'|'refresh'):IAccessTokenPayload|IRefreshTokenPayload
    decodeToken(token:string):IAccessTokenPayload|IRefreshTokenPayload
    generateRandomToken():string
    hashToken(token:string):string
    generateRandomOtp():string
    generateSessionId():string
}