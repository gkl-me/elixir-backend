import { AdminAuthDto, AdminAuthResponseDto } from "../../../interfaces/dtos/admin/AdminAuthDto";

export interface IAdminAuthService {
    login(adminAuthData:AdminAuthDto):Promise<AdminAuthResponseDto>
}