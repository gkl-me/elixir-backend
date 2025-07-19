import { injectable } from "tsyringe";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUser, User } from "../../models/User";
import { BaseRepository } from "../base/BaseRepository";
import { IUserRepository } from "./interfaces/IUserRepository";
import { CONSTANT_MESSAGES } from "../../constants/messages";


@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository{
    constructor(){
        super(User)
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            
            const user = await this._model.findOne({email})
            return user
            
        } catch (error) {
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

} 