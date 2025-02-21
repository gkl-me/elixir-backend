import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IAdminAuthService } from "./interfaces/IAdminAuthService";

export class AdminAuthService implements IAdminAuthService{

    constructor(
        public tokenManager: ITokenManager
    ){}

    async login(email:string, password:string){
        try {
            
            if(!email.trim() ||!password.trim()){
                throw new CustomError(ERROR_MESSAGES.INVALID_INPUT, STATUS_CODES.INVALID_INPUT)
            }
            
            if(email.trim() !== process.env.ADMIN_EMAIL || password.trim() !== process.env.ADMIN_PASS){
                
                throw new CustomError("Invalid credentials", STATUS_CODES.UNAUTHORIZED)
            } 

            const token = this.tokenManager.generateAccessToken(process.env.ADMIN_EMAIL,'admin')

            return {token}

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        
    }
}