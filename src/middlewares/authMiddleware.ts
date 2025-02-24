import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../helper/responseHanlder";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { STATUS_CODES } from "../constants/statusCodes";
import { TokenManager } from "../utils/TokenManager";

const tokenManager = new TokenManager()

export const auth = async (req:Request,res:Response,next:NextFunction) => {

    const {token} = req.cookies;

    
    if(!token) {

        return errorResponse(res,ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }
    
    let decoded;
    if(token) {
        decoded = await tokenManager.verifyToken(token,'access')
        
        if(!decoded){
            return errorResponse(res,ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }


                if(decoded.id !== process.env.ADMIN_EMAIL!){

                    return errorResponse(res,ERROR_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
                                }
    }

    next();
}