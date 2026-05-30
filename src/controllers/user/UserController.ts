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
export class UserController implements IUserController {
  constructor(@inject(Token.UserService) private _userService: IUserService) {}

  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.query, [
        "search",
        "sortBy",
        "limit",
        "page",
        "sortOrder",
        "status",
      ]);

      const processedParams = {
        search: params?.search || "",
        page: parseInt(params?.page || "1"),
        limit: parseInt(params?.limit || "10"),
        sortBy: params?.sortBy || "",
        sortOrder: params?.sortOrder === "desc" ? -1 : 1,
        status: params?.status || "",
      };

      const { users, totalCount } =
        await this._userService.getAllUsers(processedParams);
      successResponse(res, USER_MESSAGES.FETCH_SUCCESS, STATUS_CODES.OK, {
        users,
        totalCount,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleBlockStatus(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, ["id"]);
      const userId = params?.id;

      if (!userId) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );
      }

      await this._userService.toggleBlockStatus(userId);

      successResponse(res, USER_MESSAGES.TOGGLE_SUCCESS, STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }

  async handleChangePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId

      //validate input

      await this._userService.changePassword({userId,currentPassword,newPassword})

      successResponse(res, USER_MESSAGES.PASSWORD_UPDATED, STATUS_CODES.OK, {})
      
    } catch (error) {
      next(error)
    }
  }

  async handleListActiveSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      
      const userId = req.user.userId
      const accessToken = req.headers.authorization?.split(" ")[1] || ""

      const activeSessions = await this._userService.listActiveSessions({userId,accessToken})

      successResponse(res, USER_MESSAGES.FETCH_SUCCESS, STATUS_CODES.OK, {activeSessions})

    } catch (error) {
      next(error)
    }
  }


  async handleUpdateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {


      const {name,bio,jobTitle} = req.body
      const userId = req.user.userId

      await this._userService.updateProfile({
        name,
        bio,
        userId,
        jobTitle
      })

      successResponse(res,USER_MESSAGES.PROFILE_UPDATED,STATUS_CODES.OK,{})

    } catch (error) {
      next(error)
    }
  }
}
