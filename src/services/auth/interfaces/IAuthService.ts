// import { IAuthResponseDTO, IForgotPasswordDto, IGoogleAuthDto, ILoginDTO, ILogoutDto, IRefreshTokenDto, IRefreshTokenResponseDto, IRegisterDTO, IResendOtpDto, IResendVerficationDto, IResetPasswordDto, IVerifyDTO, IVerifyEmailDTO, IVerifyOtpDto, IVerifyOtpResponseDto } from "../../../interfaces/dtos/AuthDTO"

import { IAuthResponseDto, IGoogleAuthDto, ILoginDto, ILogoutDto, IRefreshTokenDto, IRefreshTokenResponseDto, IRegisterDto,} from "../../../interfaces/dtos/AuthDTO";
import { ILoginMetaDto } from "../../../interfaces/dtos/MetaDto";


export interface IAuthService {
    register(data:IRegisterDto):Promise<void>
    login(data:ILoginDto,meta:ILoginMetaDto): Promise<IAuthResponseDto>
    googleAuth(data:IGoogleAuthDto):Promise<IAuthResponseDto>
    refreshToken(data:IRefreshTokenDto):Promise<IRefreshTokenResponseDto>
    logout(data:ILogoutDto):Promise<void>
}
