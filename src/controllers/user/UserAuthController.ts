import { NextFunction, Request, response, Response } from "express";
import { IUserAuthService } from "../../services/user/interfaces/IUserAuthService";
import { IUserAuthController } from "./interface/IUserAuthController";
import { CustomError } from "../../errors/CustomError";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IUserLoginDTO, IUserRegisterDTO } from "../../interfaces/dtos/user/AuthDTO";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { setCookie } from "../../helper/cookiesHelper";

@injectable()
export class UserAuthController implements IUserAuthController {
    constructor(
        @inject(Token.UserAuthService) private userAuthService: IUserAuthService
    ){}

    async registerUser(req:Request, res:Response,next:NextFunction){
        try {
            const { email, password, name }:IUserRegisterDTO = req.body
            
            const user = await this.userAuthService.registerUser({email, password, name})

            return successResponse(res,"User successfully registered",STATUS_CODES.CREATED,user)

        } catch (error) {
           next(error)
        }
    }

    async loginUser(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            
            const {email,password}:IUserLoginDTO = req.body

            const authUser = await this.userAuthService.loginUser({email, password})

            const {refreshToken,accessToken,user} = authUser

            setCookie(res,'access','accessToken',accessToken)
            setCookie(res,'refresh','refreshToken',refreshToken)

           return successResponse(res,"User successfully logged in.",STATUS_CODES.OK,{user})

        } catch (error) {
            next(error)
        }
    }
}