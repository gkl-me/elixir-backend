import { inject, injectable } from "tsyringe";
import { IUserController } from "./interface/IUserController";
import { IUserService } from "../../services/user/interface/IUserService";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { CONSTANT_MESSAGES, USER_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { Token } from "../../di/token";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class UserController implements IUserController{
    
    constructor(
        @inject(Token.UserService) private _userService:IUserService
    ){}


    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const params = extractStringQueryParams(req.query,['search','sortBy','limit','page','sortOrder','status'])

            const processedParams = {
                search:params?.search || "",
                page:parseInt(params?.page || "0"),
                limit:parseInt(params?.limit || "10"),
                sortBy:params?.sortBy || "",
                sortOrder:params?.sortOrder == 'desc' ? -1 : 1,
                status:params?.status || ""
            }

            const allUsers = await this._userService.getAllUsers(processedParams)
            successResponse(res,USER_MESSAGES.FETCH_SUCCESS,STATUS_CODES.OK,allUsers)
        } catch (error) {
            next(error)
        }
    }

    async toggleBlockStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {id} = req.params

            if(!id){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            await this._userService.toggleBlockStatus(id)

            successResponse(res,USER_MESSAGES.TOGGLE_SUCCESS,STATUS_CODES.OK,{})

        } catch (error) {
            next(error)
        }
    }

}