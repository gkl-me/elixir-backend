export interface IAdminAuthService {
    login(email:string, password:string):Promise<{token:string}>
}