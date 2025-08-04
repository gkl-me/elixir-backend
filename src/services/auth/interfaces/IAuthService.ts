import { IGoogleAuthDto } from "../../../interfaces/dtos/AdminDto"
import { IAuthResponseDTO, ILoginDTO, IRegisterDTO, IVerifyDTO, IVerifyEmailDTO } from "../../../interfaces/dtos/AuthDTO"


export interface IAuthService {
    registerUser(data:IRegisterDTO): Promise<void>
    loginUser(data:ILoginDTO): Promise<IAuthResponseDTO>
    sendVerificationEmail(data:IVerifyEmailDTO):Promise<void>
    verifyUser(data:IVerifyDTO):Promise<void>
    googleAuth(data:IGoogleAuthDto):Promise<IAuthResponseDTO>
}