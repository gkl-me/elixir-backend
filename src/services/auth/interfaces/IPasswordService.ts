import {
  IForgotPasswordDto,
  IForgotPasswordResponseDto,
  IResetPasswordDto,
} from "../../../interfaces/dtos/AuthDTO";

export interface IPasswordService {
  forgotPassword(data: IForgotPasswordDto): Promise<IForgotPasswordResponseDto>;
  resetPassword(data: IResetPasswordDto): Promise<void>;
}
