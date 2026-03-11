import { IAuthResponseDto, ISendVerificationEmailDto, IVerifyEmailDto, IVerifyOtpResponseDto } from "../../../interfaces/dtos/AuthDTO"
import { IVerifyMetaDto } from "../../../interfaces/dtos/MetaDto"


export interface IVerifyService {
    sendVerificationEmail(data:ISendVerificationEmailDto):Promise<void>
    verifyEmail(data:IVerifyEmailDto,meta:IVerifyMetaDto):Promise<void>
}
