import { ISendVerificationEmailDto, IVerifyEmailDto, IVerifyOtpResponseDto } from "../../../interfaces/dtos/AuthDTO"


export interface IVerifyService {
    sendVerificationEmail(data:ISendVerificationEmailDto):Promise<void>
    verifyEmail(data:IVerifyEmailDto):Promise<void>
}
