import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { CustomError } from "../../errors/CustomError";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { adminDtoMapper } from "../../interfaces/mapper/adminDtoMapper";
import { Token } from "../../di/token";
import { IGetAllUsersDto, UserListDto } from "../../interfaces/dtos/UserDTo";
import { IUserService } from "./interface/IUserService";

@injectable()
export class UserService implements IUserService{
    constructor(
        @inject(Token.UserRepository) private _userRepository:IUserRepository
    ){}

    async getAllUsers(data:IGetAllUsersDto):Promise<{users:UserListDto[],totalCount:number}|null>{
        try {
            
            const {search,page,limit,sortBy,sortOrder,status} = data

            const skip = (page) * limit
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
                mappedUsers = allUsers.map((user) => adminDtoMapper.toUserListDto(user))
            }

            return {
                users:mappedUsers || [],
                totalCount,
            }

        } catch (error) {
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)   
        }
    }

    async toggleBlockStatus(id:string){
        try {
            
            const userFound = await this._userRepository.findById(id)
            if(!userFound) throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)

            userFound.isBlocked = !userFound.isBlocked
            userFound.save()

        } catch (error) {
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR) 
        }
    }
}