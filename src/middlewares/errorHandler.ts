import { NextFunction, Request, Response } from "express"
import { errorResponse } from "../helper/responseHanlder"
import { CustomError } from "../errors/CustomError"
import logger from "./logger"
import { CONSTANT_MESSAGES } from "../constants/messages"
import { STATUS_CODES } from "../constants/statusCodes"

export const  errorHandler = (err:unknown,req:Request,res:Response,next:NextFunction)=>{
    if(err){
        logger.error(err)
        if(err instanceof CustomError) return errorResponse(res,err.message,err.statusCode,err.errorCode)
        return errorResponse(res,CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
    }else{
        next()
    }
}

