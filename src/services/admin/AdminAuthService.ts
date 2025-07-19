import { inject, injectable } from "tsyringe";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IAdminAuthService } from "./interfaces/IAdminAuthService";
import { Token } from "../../di/token";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { AdminAuthDto, AdminAuthResponseDto, AdminRefreshTokenDto, AdminRefreshTokenResponseDto } from "../../interfaces/dtos/AdminDto";
import { Admin } from "../../models/Admin";

@injectable()
export class AdminAuthService implements IAdminAuthService{

    constructor(
        @inject(Token.TokenManager) private _tokenManager: ITokenManager,
        @inject(Token.PasswordHasher) private _passwordHashed:IPasswordHasher
    ){}

    async login(data:AdminAuthDto):Promise<AdminAuthResponseDto>{
        try {

            const {email,password } = data

            if(( email && !email.trim() ) || (password && !password.trim())){
                throw new CustomError(CONSTANT_MESSAGES.INVALID_INPUT, STATUS_CODES.BAD_REQUEST)
            }

            const isAdmin = await Admin.findOne({email})
            if(!isAdmin){
                throw new CustomError(CONSTANT_MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.BAD_REQUEST)
            }
            const passwordMatch = await this._passwordHashed.comparePasswords(password,isAdmin.password)
            if(!passwordMatch){
                throw new CustomError(CONSTANT_MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.BAD_REQUEST)
            }

            const token = this._tokenManager.generateAccessToken(isAdmin._id as string,'admin')
            const adminRefresh = this._tokenManager.generateRefreshToken(isAdmin._id as string,'admin')

            return {
                token,
                adminRefresh,
                id:isAdmin._id as string,
                name:isAdmin.name,
                email:isAdmin.email
            }

        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        
    }

    async me(id:string){
        try {
            
            if(!id){
                throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
            }

            const isAdmin = await Admin.findById(id)
            if(!isAdmin){
                throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
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
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async refreshToken(data:AdminRefreshTokenDto):Promise<AdminRefreshTokenResponseDto>{
        try {

            const {adminRefresh} = data

            if(!adminRefresh){
                throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
            }

            const decoded = this._tokenManager.verifyToken(adminRefresh,"refresh")
            if(!decoded){
                throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
            }

            const token = this._tokenManager.generateAccessToken(decoded.id,decoded.role)

            return {
                token
            }
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }

            throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
    }
}