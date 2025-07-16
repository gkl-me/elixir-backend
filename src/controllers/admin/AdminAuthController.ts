import { NextFunction, Request, response, Response } from "express";
import { CustomError } from "../../errors/CustomError";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
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
        @inject(Token.AdminAuthService) private adminAuthService:IAdminAuthService
    ){}

    async login(req:Request,res:Response,next:NextFunction) {
        try {

            const {email , password} = req.body;

            const {token,adminRefresh,...admin} = await this.adminAuthService.login({email,password})   

            setCookie(res,'access',"token",token)
            setCookie(res,'refresh','adminRefresh',adminRefresh)

            successResponse(res,"Admin Login Succesful",STATUS_CODES.OK,{...admin})
            
        } catch (error) {
            next(error)
        }
    }

    async me(req: Request, res: Response, next: NextFunction){
        try {
            
            const {id} = req.admin!
            const admin = await this.adminAuthService.me(id)
            successResponse(res,"Admin details fetched",STATUS_CODES.OK,admin)

        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            clearCookie(res,'token')
            clearCookie(res,'adminToken')
            successResponse(res,"Admin Logout success",STATUS_CODES.OK,{})
        } catch (error) {
            next(new CustomError('Failed to logout admin',STATUS_CODES.INTERNAL_SERVER_ERROR))
        }
    }

    async refresh(req:Request,res:Response,next:NextFunction): Promise<void> {
        try {

            const {adminRefresh} = req.cookies

            const {token} = await this.adminAuthService.refreshToken({adminRefresh})

            res.cookie('token',token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                sameSite: 'lax',
            })

            successResponse(res,'Admin Token Refresh Success',STATUS_CODES.OK,{})

        } catch (error) {
            next(error)
        }
    }
}