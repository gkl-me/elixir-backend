import { Request, Response } from "express";
import { IUserVerifyService } from "../../services/user/interfaces/IUserVerifyService";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { IUserVerifyController } from "./interface/IUserVerifyController";

export class UserVerifyController implements IUserVerifyController {
    constructor(
        private userVerifySerice:IUserVerifyService
    ){}

    async verifyUser(req: Request, res: Response){
        try {
            
            const { token } = req.query

            await this.userVerifySerice.verifyUser(token as string)
            return successResponse(res,"User verified",STATUS_CODES.OK,"Success")

        } catch (error) {
            if(error instanceof CustomError){
                errorResponse(res,error.message,error.statusCode)
            }
        }
    }
}