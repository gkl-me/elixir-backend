import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IAdminAuthService } from "./interfaces/IAdminAuthService";
import { Token } from "../../di/token";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { AdminAuthDto, AdminAuthResponseDto } from "../../interfaces/dtos/admin/AdminAuthDto";
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

            if(!email.trim() ||!password.trim()){
                throw new CustomError(ERROR_MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST)
            }

            const isAdmin = await Admin.findOne({email})
            if(!isAdmin){
                throw new CustomError("Invalid email or password ",STATUS_CODES.BAD_REQUEST)
            }

            const passwordMatch = this.passwordHashed.comparePasswords(isAdmin.password,password)
            if(!passwordMatch){
                throw new CustomError("Invalid email or password",STATUS_CODES.BAD_REQUEST)
            }

            const token = this.tokenManager.generateAccessToken(isAdmin.email,'admin')

            return {token}

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        
    }
}