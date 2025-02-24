import { Request, response, Response } from "express";
import { IAdminUserManagemetService } from "../../services/admin/interfaces/IAdminUserManagementService";
import { IAdminUserController } from "./interface/IAdminUserController";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";


export class AdminUserController implements IAdminUserController{

    constructor(
        private adminUserManagementService: IAdminUserManagemetService
    ){}

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            
            const allUsers = await this.adminUserManagementService.getAllUsers()
            return successResponse(res,"Users fetched successfully",STATUS_CODES.OK,allUsers)

        } catch (error) {
            if(error instanceof CustomError)
            return errorResponse(res,error.message,error.statusCode)
        }
    }

    async blockUser(req: Request, res: Response): Promise<void> {
        try {
            
            const userId = req.params.userId

            const blockedUser = await this.adminUserManagementService.blockUser(userId)

            successResponse(res,"User blocked successfully",STATUS_CODES.OK,blockedUser)

        } catch (error) {
            if(error instanceof CustomError)
            return errorResponse(res,error.message,error.statusCode)
        }
    }

}