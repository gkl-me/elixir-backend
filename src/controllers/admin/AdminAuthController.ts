import { NextFunction, Request, response, Response } from "express";
import { CustomError } from "../../errors/CustomError";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IAdminAuthService } from "../../services/admin/interfaces/IAdminAuthService";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { IAdminAuthController } from "./interface/IAdminAuthController";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";

@injectable()
export class AdminAuthController implements IAdminAuthController {

    constructor(
        @inject(Token.AdminAuthService) private adminAuthService:IAdminAuthService
    ){}

    async login(req:Request,res:Response,next:NextFunction) {
        try {

            const {email , password} = req.body;

            const {token} = await this.adminAuthService.login({email,password})   

            res.cookie('token',token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                sameSite: 'lax',
            })

            successResponse(res,"Admin Login Succesful",STATUS_CODES.OK,{})
            
        } catch (error) {
            next(error)
        }
    }
}