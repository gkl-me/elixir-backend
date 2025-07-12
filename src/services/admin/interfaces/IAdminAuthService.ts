import { AdminAuthDto, AdminAuthResponseDto, AdminRefreshTokenDto, AdminRefreshTokenResponseDto, AdminResponseDto } from "../../../interfaces/dtos/admin/AdminAuthDto";

export interface IAdminAuthService {
    login(adminAuthData:AdminAuthDto):Promise<AdminAuthResponseDto>
    me(id:string):Promise<AdminResponseDto>;
    refreshToken(data:AdminRefreshTokenDto):Promise<AdminRefreshTokenResponseDto>
}