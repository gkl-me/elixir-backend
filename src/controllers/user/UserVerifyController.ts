import { NextFunction, Request, Response } from "express";
import { IUserVerifyService } from "../../services/user/interfaces/IUserVerifyService";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { IUserVerifyController } from "./interface/IUserVerifyController";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class UserVerifyController implements IUserVerifyController {
    constructor(
        @inject(Token.UserVerifyService) private userVerifySerice:IUserVerifyService
    ){}

    async verifyUser(req: Request, res: Response,next:NextFunction){
        try {
            
            const params= extractStringQueryParams(req.query,["token"])
            const token = params?.token

            console.log(token)

            await this.userVerifySerice.verifyUser(token)
            return successResponse(res,"User verified",STATUS_CODES.OK,"Success")

        } catch (error) {
            next(error)
        }
    }
}