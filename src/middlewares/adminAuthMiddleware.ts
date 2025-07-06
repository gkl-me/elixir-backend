import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ITokenManager } from "../utils/interfaces/ITokenManager";
import { Token } from "../di/token";
import { CustomError } from "../errors/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";



export const adminAuth = async (req:Request,res:Response,next:NextFunction) => {
    try {

        const tokenManager = container.resolve<ITokenManager>(Token.TokenManager)
        const {token } = req.cookies
        if(!token){
            throw new CustomError('Unauthorized access login again',STATUS_CODES.UNAUTHORIZED)
        }

        const validToken = tokenManager.verifyToken(token,'access')

        if(!validToken){
            throw new CustomError('Unauthorized access login again',STATUS_CODES.UNAUTHORIZED)
        }
        req.admin = { id:validToken.id,role:validToken.role }
        next()
    } catch (error) {
        next(new CustomError("Unathorized access login again",STATUS_CODES.UNAUTHORIZED))
    }
}