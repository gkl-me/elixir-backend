import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ITokenManager } from "../providers/interfaces/ITokenManager";
import { Token } from "../di/token";
import { CustomError } from "../errors/CustomError";
import { AUTH_MESSAGES, CONSTANT_MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import { IUserRepository } from "../repositories/user/interfaces/IUserRepository";
import { ICacheRepository } from "../repositories/cache/ICacheRepository";
import { REDIS_STORE } from "../constants/redis/redisStore";



export const auth = async (req:Request,res:Response,next:NextFunction) => {
    try {
        
        const tokenManager = container.resolve<ITokenManager>(Token.TokenManager)
        const userRepository = container.resolve<IUserRepository>(Token.UserRepository)
        const cacheRepository = container.resolve<ICacheRepository<string>>(Token.CacheRepository)

        const {accessToken} = req.cookies

        if(!accessToken){
            throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }

        //check blacklisted 
        const isBlackListed  = await cacheRepository.exists(REDIS_STORE.BLACKLIST+accessToken)
        if(isBlackListed){
            throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

        const tokenValid = tokenManager.verifyToken(accessToken,'access')

        if(!tokenValid){
            throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }

        //check if the user is blocked or not

        const userFound = await userRepository.findById(tokenValid.id)

        if(userFound?.isBlocked){
            throw new CustomError(AUTH_MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN)
        }

        req.user = {id:tokenValid.id,role:tokenValid.role}
        next()
    } catch (error) {
        if(error instanceof CustomError){
            next(error)
        }
        next(new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED))
    }
}