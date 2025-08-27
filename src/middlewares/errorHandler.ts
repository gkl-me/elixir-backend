import { NextFunction, Request, Response } from "express"
import { errorResponse } from "../helper/responseHanlder"
import { CustomError } from "../errors/CustomError"
import logger from "./logger"

export const  errorHandler = (err:CustomError,req:Request,res:Response,next:NextFunction)=>{
    if(err){
        logger.error(err)
        errorResponse(res,err.message,err.statusCode)
    }else{
        next()
    }
}

