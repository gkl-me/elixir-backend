import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper/responseHanlder";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCodes";
import { TokenManager } from "../utils/TokenManager";

const tokenManager = new TokenManager()

export const auth = async (req:Request,res:Response,next:NextFunction) => {

    const {token,refreshToken,accessToken} = req.cookies;

    if(!token && !refreshToken && !accessToken) {
        return errorResponse(res,ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }

    let decoded;
    if(token || refreshToken || accessToken) {
        decoded = await tokenManager.verifyToken(token,'access')
        
        if(!decoded){
            return errorResponse(res,ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }
        
        //validate token
        switch(decoded.role){
            case 'admin':
                if(decoded.id !== process.env.ADMIN_EMAIL!){
                    return errorResponse(res,ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
                }
            default:
                return errorResponse(res,ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }
    }

    next();
}