import { Request, response, Response } from "express";
import { CustomError } from "../../errors/CustomError";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IAdminAuthService } from "../../services/admin/interfaces/IAdminAuthService";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { IAdminAuthController } from "./interface/IAdminAuthController";

export class AdminAuthController implements IAdminAuthController {

    constructor(
        public adminAuthService:IAdminAuthService
    ){}

    async login(req:Request,res:Response){
        try {

            const {email , password} = req.body;

            const {token} = await this.adminAuthService.login(email,password)   

            res.cookie('token',token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                sameSite: 'strict',
            })

            successResponse(res,"Login Succesful",STATUS_CODES.OK,{token})
            
        } catch (error) {
            if(error instanceof CustomError){
                errorResponse(res,error.message,error.statusCode)
            }
        }
    }
}