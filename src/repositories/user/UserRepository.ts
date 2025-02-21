import { IUser } from "../../models/User";
import { IUserRepository } from "./interfaces/IUserRepository";
import { User } from "../../models/User";
import { CreatUserDTO, UpdateUserDTO, UserResponseDTO } from "../../interfaces/dtos/UserDTO";

export class UserRepository implements IUserRepository{
    
    async findByEmail(email: string): Promise<IUser> {
        try {
            
            const user = await User.findOne({email})
            if(!user){
                throw new Error('User not found')
            }
            return user
        } catch (error) {
            console.log(error)
            if(error instanceof Error){
                throw new Error(error.message)
            }
            throw new Error('Unexpected Error')
        }
    }

    async findById(id: string): Promise<IUser> {
        try {
            
            const user = await User.findOne({_id:id})
            if(!user){
                throw new Error('User not found')
            }
            return user
        } catch (error) {
            console.log(error)
            if(error instanceof Error){
                throw new Error(error.message)
            }
            throw new Error('Unexpected Error')
        }
    }


    async create(user: CreatUserDTO): Promise<UserResponseDTO> {
        try {
            const {name,email,password} = user
            const newUser = await User.create({name,email,password})
            if(!newUser){
                throw new Error('Unable to add new user')
            }
            return {
                id:newUser._id as string,
                name:newUser.name,
                email:newUser.email
            }
        } catch (error) {
            console.log(error)
            if(error instanceof Error){
                throw new Error(error.message)
            }
            throw new Error('Unexpected Error')
        }
    }

    async update(user: UpdateUserDTO): Promise<UserResponseDTO> {
        try {
            const updatedUser = await User.findByIdAndUpdate(user.id, user);
            if (!updatedUser) {
                throw new Error('User unable to update');
            }
            return {
                id: updatedUser._id as string,
                name: updatedUser.name,
                email: updatedUser.email
            };
        } catch (error) {
            console.log(error);
            if(error instanceof Error) throw new Error(error.message)
            throw new Error('Unexpected error occured')
        }
    }
}