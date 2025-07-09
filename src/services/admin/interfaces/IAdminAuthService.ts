import { AdminAuthDto, AdminAuthResponseDto, AdminResponseDto } from "../../../interfaces/dtos/admin/AdminAuthDto";

export interface IAdminAuthService {
    login(adminAuthData:AdminAuthDto):Promise<AdminAuthResponseDto>
    me(id:string):Promise<AdminResponseDto>;
}