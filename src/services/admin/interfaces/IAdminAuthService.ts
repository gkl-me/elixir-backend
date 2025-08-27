import { AdminAuthDto, AdminAuthResponseDto, AdminRefreshTokenDto, AdminRefreshTokenResponseDto, AdminResponseDto } from "../../../interfaces/dtos/AdminDto";

export interface IAdminAuthService {
    login(data:AdminAuthDto):Promise<AdminAuthResponseDto>
    me(id:string):Promise<AdminResponseDto>;
    refreshToken(data:AdminRefreshTokenDto):Promise<AdminRefreshTokenResponseDto>
}