import { NextFunction, Request, Response } from "express"
import { errorResponse } from "../helper/responseHanlder"
import { CustomError } from "../errors/CustomError"

export const  errorHandler = (err:CustomError,req:Request,res:Response,next:NextFunction)=>{
    console.error(err)
    errorResponse(res,err.message,err.statusCode)
    next()
}

