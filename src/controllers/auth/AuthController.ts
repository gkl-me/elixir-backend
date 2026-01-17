import { NextFunction, Request, response, Response } from "express";
import { IAuthService } from "../../services/auth/interfaces/IAuthService";
import { IAuthController } from "./interface/IAuthController";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { clearCookie, setCookie } from "../../helper/cookiesHelper";
import { AUTH_MESSAGES, USER_MESSAGES } from "../../constants/messages";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(Token.AuthService) private _authService: IAuthService,
        @inject(Token.TokenManager) private _tokenManager:ITokenManager
    ){}

    async handleRegister(req:Request, res:Response,next:NextFunction){
        try {
            const { email, password, name } = req.body
            
            const user = await this._authService.register({email, password, name})

            return successResponse(res,USER_MESSAGES.REGISTER_USER,STATUS_CODES.CREATED,user)

        } catch (error) {
           next(error)
        }
    }

    async handleLogin(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            
            const {email,password} = req.body

            const authUser = await this._authService.login({email, password})

            const {...user} = authUser
            const accessToken = this._tokenManager.generateAccessToken(user.id,user.role)
            const refreshToken = this._tokenManager.generateRefreshToken(user.id,user.role)

            setCookie(res,'access','accessToken',accessToken)
            setCookie(res,'refresh','refreshToken',refreshToken)

           return successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,user)

        } catch (error) {
            next(error)
        }
    }


    async handleGoogleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    async handleRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {refreshToken} = req.cookies

            const {accessToken} = await this._authService.refreshToken({refreshToken})
            
            setCookie(res,'access','accessToken',accessToken)

            successResponse(res,AUTH_MESSAGES.TOKEN_REFRESH,STATUS_CODES.OK,{})

        } catch (error) {
            next(error)
        }
    }

    async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const {accessToken,refreshToken} = req.cookies

            await this._authService.logout({accessToken,refreshToken})

            clearCookie(res,'accessToken')
            clearCookie(res,'refreshToken')

            successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,{})
        } catch (error) {
            next(error)
        }
    }

}