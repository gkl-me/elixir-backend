import { injectable } from "tsyringe";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUser, User } from "../../models/User";
import { BaseRepository } from "../base/BaseRepository";
import { IUserRepository } from "./interfaces/IUserRepository";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import logger from "../../middlewares/logger";


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

    async findAllUsers({
        search,
        status
    }:{
        search:string,
        status:string
    }
    ,options?:{
        sort?:Record<string,1|-1>,
        limit?:number,
        skip?:number
    }):Promise<IUser[] | null>{

       try {
        
        const searchFilter = search ? {
            $or: [
                {email:{$regex:`^${search}`,$options:'i'}},
                {name:{$regex:`^${search}`,$options:'i'}}
            ]
        } : {}

        let combineSearch = {
            ...searchFilter,
            ...(status ? {isBlocked: status === "blocked"}:{}),
            isVerified:true,
            role:"user"
        }

        return this.findAll(combineSearch,options)

       } catch (error) {
            logger.error(error)
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        
    }
    
    async findUsersCount(): Promise<number> {
        try {

            let totalCount = 0

            totalCount = await this._model.find({
                isVerified:true,
                role:'user'
            }).countDocuments()

            return totalCount
            
        } catch (error) {
            logger.error(error)
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
} 