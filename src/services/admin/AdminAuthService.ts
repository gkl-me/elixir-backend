import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IAdminAuthService } from "./interfaces/IAdminAuthService";
import { Token } from "../../di/token";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { AdminAuthDto } from "../../interfaces/dtos/admin/AdminAuthDto";
import { Admin } from "../../models/Admin";

@injectable()
export class AdminAuthService implements IAdminAuthService{

    constructor(
        @inject(Token.TokenManager) private tokenManager: ITokenManager,
        @inject(Token.PasswordHasher) private passwordHashed:IPasswordHasher
    ){}

    async login(adminAuthData:AdminAuthDto){
        try {

            const {email,password } = adminAuthData

            if(( email && !email.trim() ) || (password && !password.trim())){
                throw new CustomError(ERROR_MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST)
            }

            const isAdmin = await Admin.findOne({email})
            if(!isAdmin){
                throw new CustomError("Invalid email or password ",STATUS_CODES.BAD_REQUEST)
            }
            const passwordMatch = await this.passwordHashed.comparePasswords(password,isAdmin.password)
            if(!passwordMatch){
                throw new CustomError("Invalid email or password",STATUS_CODES.BAD_REQUEST)
            }

            const token = this.tokenManager.generateAccessToken(isAdmin._id as string,'admin')

            return {
                token,
                id:isAdmin._id as string,
                name:isAdmin.name,
                email:isAdmin.email
            }

        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        
    }

    async me(id:string){
        try {
            
            if(!id){
                throw new CustomError("Unathorized access login again",STATUS_CODES.UNAUTHORIZED)
            }

            const isAdmin = await Admin.findById(id)
            if(!isAdmin){
                throw new CustomError("Unathorized access login again",STATUS_CODES.UNAUTHORIZED)
            }
            return {
                id:isAdmin._id as string,
                name:isAdmin.name,
                email:isAdmin.email
            }
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}