import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { CustomError } from "../../errors/CustomError";
import { AUTH_MESSAGES, CONSTANT_MESSAGES, USER_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { userDtoMapper } from "../../interfaces/mapper/userDtoMapper";
import { Token } from "../../di/token";
import { IUserService } from "./interface/IUserService";
import { IUpdatePasswordDto, IUserListDto, IUserQueryDto } from "../../interfaces/dtos/UserDTo";
import { IPasswordHasher } from "../../providers/interfaces/IPasswordHasher";
import logger from "../../middlewares/logger";

@injectable()
export class UserService implements IUserService{
    constructor(
        @inject(Token.UserRepository) private _userRepository:IUserRepository,
        @inject(Token.PasswordHasher) private _passwordHasher:IPasswordHasher
    ){}

    async getAllUsers(data:IUserQueryDto):Promise<{users:IUserListDto[],totalCount:number}>{
        try {
            
            const {search,page,limit,sortBy,sortOrder,status} = data

            const skip = (page-1) * limit
            const sort:Record<string,-1|1> = {}
            if(sortBy){
                sort[sortBy] = sortOrder === -1 ? -1 : 1
            }

            const allUsers = await this._userRepository.findAllUsers({
                search,status
            },{
                sort,
                skip,
                limit
            })


            const totalCount = await this._userRepository.findUsersCount()

            let mappedUsers = null
            if(allUsers?.length){
                mappedUsers = allUsers.map((user) => userDtoMapper.toUserListDto(user))
            }

            return {
                users:mappedUsers || [],
                totalCount,
            }

        } catch (error) {
            logger.error(error)
            throw error   
        }
    }

    async toggleBlockStatus(id:string){
        try {
            
            const userFound = await this._userRepository.findById(id)
            if(!userFound) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

            userFound.isBlocked = !userFound.isBlocked
            userFound.save()

        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    async updatePassword(data: IUpdatePasswordDto): Promise<void> {
        try {

            const {email,newPassword} = data

            const user = await this._userRepository.findByEmail(email)
            if(!user) throw new CustomError(AUTH_MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)

            const hashPassword = await this._passwordHasher.hashPassword(newPassword)
            if(user && user.password){
                user.password = hashPassword
                user.save()
            }

            
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
}