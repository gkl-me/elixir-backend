import { ISendOtpDto, IVerifyOtpDto, IVerifyOtpResponseDto } from "../../../interfaces/dtos/AuthDTO";



export interface IOtpService{
    sendOtp(data:ISendOtpDto):Promise<void>
    verfiyOtp(data:IVerifyOtpDto):Promise<IVerifyOtpResponseDto>
}