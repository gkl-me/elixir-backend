import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../services/auth/interfaces/IAuthService";
import { IAuthController } from "./interface/IAuthController";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { clearCookie, setCookie } from "../../helper/cookiesHelper";
import { AUTH_MESSAGES, USER_MESSAGES } from "../../constants/messages";
import { LoginSchema, RegisterSchema } from "../../validator/AuthSchema";
import { CustomError } from "../../errors/CustomError";
import { logInfo } from "../../middlewares/loggerHelper";
import { getClientInfo } from "../../helper/clientInfoHelper";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(Token.AuthService) private _authService: IAuthService) { }

  async handleRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      //validate user data using zod
      const validate = RegisterSchema.safeParse(data);
      if (!validate.success) {
        const errorMessages = validate.error.errors[0].message;
        throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST);
      }

      const { email, password, name } = validate.data;

      const user = await this._authService.register({ email, password, name });

      logInfo("User successfully registered", {
        requestId: req.requestId,
      });

      return successResponse(
        res,
        USER_MESSAGES.REGISTER_USER,
        STATUS_CODES.CREATED,
        user
      );
    } catch (error) {
      next(error);
    }
  }

  async handleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      //validate user data using zod
      const validate = LoginSchema.safeParse(data);
      if (!validate.success) {
        const errorMessages = validate.error.errors[0].message;
        throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST);
      }

      const { email, password } = validate.data;

      const clientInfo = getClientInfo(req);

      const authUser = await this._authService.login(
        { email, password },
        clientInfo
      );

      // setCookie(res,'refreshToken',refreshToken)

      return successResponse(
        res,
        USER_MESSAGES.LOGIN_SUCCESS,
        STATUS_CODES.OK,
        { ...authUser }
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGoogleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { idToken } = req.body;

      const clientInfo = getClientInfo(req);

      const authUser = await this._authService.googleAuth(
        { idToken },
        clientInfo
      );

      successResponse(res, USER_MESSAGES.LOGIN_SUCCESS, STATUS_CODES.OK, {
        ...authUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleGithubAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      const clientInfo = getClientInfo(req);
      const authUser = await this._authService.githubAuth(data, clientInfo);

      successResponse(res, USER_MESSAGES.LOGIN_SUCCESS, STATUS_CODES.OK, {
        ...authUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleRefresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      console.log("refres", refreshToken)

      const { newAccessToken, newRefreshToken } =
        await this._authService.refreshToken({ refreshToken });

      setCookie(res, "refreshToken", newRefreshToken);

      successResponse(res, AUTH_MESSAGES.TOKEN_REFRESH, STATUS_CODES.OK, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      await this._authService.logout({ refreshToken });

      clearCookie(res, "refreshToken");

      successResponse(res, USER_MESSAGES.LOGOUT_SUCCESS, STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }

  async handleLogoutAllDevices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user.userId;

      await this._authService.logoutAllDevices({
        userId,
      });

      clearCookie(res, "refreshToken");
      clearCookie(res, "accessToken");

      successResponse(res, USER_MESSAGES.LOGOUT_SUCCESS, STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }
}
