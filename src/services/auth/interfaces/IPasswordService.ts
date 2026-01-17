import { IForgotPasswordDto, IResetPasswordDto } from "../../../interfaces/dtos/AuthDTO";




export interface IPasswordService{
    forgotPassword(data:IForgotPasswordDto):Promise<void>
    resetPassword(data:IResetPasswordDto):Promise<void>
}