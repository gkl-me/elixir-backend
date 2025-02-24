import { Request, response, Response } from "express";
import { IUserAuthService } from "../../services/user/interfaces/IUserAuthService";
import { IUserAuthController } from "./interface/IUserAuthController";
import { CustomError } from "../../errors/CustomError";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IUserLoginDTO, IUserRegisterDTO } from "../../interfaces/dtos/user/AuthDTO";

export class UserAuthController implements IUserAuthController {
    constructor(
        private userAuthService: IUserAuthService
    ){}

    async registerUser(req:Request, res:Response){
        try {
            const { email, password, name }:IUserRegisterDTO = req.body
            
            const user = await this.userAuthService.registerUser({email, password, name})

            return successResponse(res,"User successfully registered",STATUS_CODES.CREATED,user)

        } catch (error) {
            if(error instanceof CustomError)
            return errorResponse(res,error.message,error.statusCode)
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            
            const {email,password}:IUserLoginDTO = req.body

            const authUser = await this.userAuthService.loginUser({email, password})

            const {refreshToken,accessToken,user} = authUser

            res.cookie('refreshToken',refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

           return successResponse(res,"User successfully logged in.",STATUS_CODES.OK,{user,accessToken})

        } catch (error) {
            if(error instanceof CustomError){
                return errorResponse(res,error.message,error.statusCode)
            }
        }
    }
}