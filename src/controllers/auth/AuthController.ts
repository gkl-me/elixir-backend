import { NextFunction, Request, response, Response } from "express";
import { IAuthService } from "../../services/auth/interfaces/IAuthService";
import { IAuthController } from "./interface/IAuthController";
import { CustomError } from "../../errors/CustomError";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { setCookie } from "../../helper/cookiesHelper";
import { extractStringQueryParams } from "../../helper/queryParamUtils";
import { USER_MESSAGES } from "../../constants/messages";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(Token.AuthService) private _authService: IAuthService,
        @inject(Token.TokenManager) private _tokenManager:ITokenManager
    ){}

    async registerUser(req:Request, res:Response,next:NextFunction){
        try {
            const { email, password, name } = req.body
            
            const user = await this._authService.registerUser({email, password, name})

            return successResponse(res,USER_MESSAGES.REGISTER_USER,STATUS_CODES.CREATED,user)

        } catch (error) {
           next(error)
        }
    }

    async loginUser(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            
            const {email,password} = req.body

            const authUser = await this._authService.loginUser({email, password})

            const {...user} = authUser
            const accessToken = this._tokenManager.generateAccessToken(user.id,user.role)
            const refreshToken = this._tokenManager.generateRefreshToken(user.id,user.role)

            setCookie(res,'access','accessToken',accessToken)
            setCookie(res,'refresh','refreshToken',refreshToken)

           return successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,{user})

        } catch (error) {
            next(error)
        }
    }

    async verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {token} = req.params

            await this._authService.verifyUser({token})

            return successResponse(res,USER_MESSAGES.VERIFY_USER,STATUS_CODES.ACCEPTED,{})

        } catch (error) {
            next(error)
        }
    }

    async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {name,email,googleId,image} = req.body

            const user = await this._authService.googleAuth({name,email,googleId,image})

            const accessToken = this._tokenManager.generateAccessToken(user.id,user.role)
            const refreshToken = this._tokenManager.generateRefreshToken(user.id,user.role)

            setCookie(res,'access','accessToken',accessToken)
            setCookie(res,'refresh','refreshToken',refreshToken)

            successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,user)

        } catch (error) {
            next(error)
        }
    }
}