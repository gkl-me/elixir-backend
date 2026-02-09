import { NextFunction, Request, response, Response } from "express";
import { IAuthService } from "../../services/auth/interfaces/IAuthService";
import { IAuthController } from "./interface/IAuthController";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { clearCookie, setCookie } from "../../helper/cookiesHelper";
import { AUTH_MESSAGES, USER_MESSAGES } from "../../constants/messages";


@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject(Token.AuthService) private _authService: IAuthService,
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
            const userAgent = req.headers["user-agent"]
            const ip = req.ip

            const authUser = await this._authService.login({email, password},{ip,userAgent})

            const {accessToken,refreshToken,...user} = authUser

            // setCookie(res,'refreshToken',refreshToken)

           return successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,{user,accessToken,refreshToken})

        } catch (error) {
            next(error)
        }
    }


    async handleGoogleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {idToken} = req.body
            const userAgent = req.headers["user-agent"]
            const ip = req.ip

            const {accessToken,refreshToken,...user} = await this._authService.googleAuth({idToken},{userAgent,ip})

            successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,{user,accessToken,refreshToken})

        } catch (error) {
            next(error)
        }
    }

    async handleGithubAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const data = req.body
             const userAgent = req.headers["user-agent"]
            const ip = req.ip

            const {accessToken,refreshToken,...user} = await this._authService.githubAuth(data,{userAgent,ip})

            successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,{user,accessToken,refreshToken})
            
        } catch (error) {
            next(error)
        }
    }

    async handleRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {refreshToken} = req.body

            const {newAccessToken,newRefreshToken,} = await this._authService.refreshToken({refreshToken})

            setCookie(res,'refreshToken',newRefreshToken)

            successResponse(res,AUTH_MESSAGES.TOKEN_REFRESH,STATUS_CODES.OK,{accessToken:newAccessToken,refreshToken:newRefreshToken})

        } catch (error) {
            next(error)
        }
    }

    async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const {refreshToken} = req.body

            await this._authService.logout({refreshToken})

            clearCookie(res,'refreshToken')

            successResponse(res,USER_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,{})
        } catch (error) {
            next(error)
        }
    }

}