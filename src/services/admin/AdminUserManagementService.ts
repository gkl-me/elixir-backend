import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserResponseDTO } from "../../interfaces/dtos/user/UserDTO";
import { userDtoMapper } from "../../interfaces/mapper/userDtoMapper";
import { IUser } from "../../models/User";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IAdminUserManagemetService } from "./interfaces/IAdminUserManagementService";

export class AdminUserManagementService implements IAdminUserManagemetService{

    constructor(
        private userRepository: IUserRepository // Replace with actual user repository
    ){}

    async getAllUsers(): Promise<IUserResponseDTO[]|null> {
        try {

            const allUsers = await this.userRepository.findAll({});

            if(!allUsers){
                return []
            }

            return allUsers.map(user => userDtoMapper(user))
            
        } catch (error) {
            if(error instanceof CustomError) {
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError("An unexpected error occurred while fetching users",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async blockUser(userId: string): Promise<IUserResponseDTO | null> {
        try {

            const user = await this.userRepository.findById(userId)

            if(!user) {
                throw new CustomError("User not found", STATUS_CODES.NOT_FOUND)
            }

            const status = !user?.isBlocked

            const updatedUser = await this.userRepository.update(userId,{isBlocked:status})

            if(!updatedUser) {
                throw new CustomError("Failed to update user status", STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            return userDtoMapper(updatedUser)
            
        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError("An unexpected error occurred while blocking the user", STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

}