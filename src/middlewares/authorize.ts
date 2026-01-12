import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";
import { CONSTANT_MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";



export const authorize = async (...allowedRoles:string[]) => 
(req:Request,res:Response,next:NextFunction) => {

    try {
        
        if(!req.user){
            throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        
        const {role} = req.user
        
        if(!allowedRoles.includes(role)){
            throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }

        next()
        
    } catch (error) {

        if(error instanceof CustomError){
            next(error)
        }

        next(new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED))   
    }
}