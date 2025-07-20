import { NextFunction, Request, response, Response } from "express";
import { CustomError } from "../../errors/CustomError";
import { ADMIN_MESSAGES, CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IAdminAuthService } from "../../services/admin/interfaces/IAdminAuthService";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { IAdminAuthController } from "./interface/IAdminAuthController";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { clearCookie, setCookie } from "../../helper/cookiesHelper";

@injectable()
export class AdminAuthController implements IAdminAuthController {

    constructor(
        @inject(Token.AdminAuthService) private _adminAuthService:IAdminAuthService
    ){}

    async login(req:Request,res:Response,next:NextFunction) {
        try {

            const {email , password} = req.body;

            const {token,adminRefresh,...admin} = await this._adminAuthService.login({email,password})   

            setCookie(res,'access',"token",token)
            setCookie(res,'refresh','adminRefresh',adminRefresh)

            successResponse(res,ADMIN_MESSAGES.LOGIN_SUCCESS,STATUS_CODES.OK,{...admin})
            
        } catch (error) {
            next(error)
        }
    }

    async me(req: Request, res: Response, next: NextFunction){
        try {
            
            const {id} = req.admin!
            const admin = await this._adminAuthService.me(id)
            successResponse(res,ADMIN_MESSAGES.FETCH_SUCCESS,STATUS_CODES.OK,admin)

        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            clearCookie(res,'token')
            clearCookie(res,'adminRefresh')
            successResponse(res,ADMIN_MESSAGES.LOGOUT_SUCCESS,STATUS_CODES.OK,{})
        } catch (error) {
            next(new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    async refresh(req:Request,res:Response,next:NextFunction): Promise<void> {
        try {

            const {adminRefresh} = req.cookies

            const {token} = await this._adminAuthService.refreshToken({adminRefresh})

            setCookie(res,'access','token',token)

            successResponse(res,ADMIN_MESSAGES.REFRESH_SUCCESS,STATUS_CODES.OK,{})

        } catch (error) {
            clearCookie(res,"token")
            clearCookie(res,"adminRefresh",)
            next(error)
        }
    }
}