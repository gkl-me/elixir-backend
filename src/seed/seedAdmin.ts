import { container } from "tsyringe"
import { IPasswordHasher } from "../utils/interfaces/IPasswordHasher"
import { IUserRepository } from "../repositories/user/interfaces/IUserRepository"


export async function seedAdmin(){
    try {
        const adminData = {
            name:'admin',
            email:process.env.ADMIN_EMAIL || "",
            password:process.env.ADMIN_PASSWORD || "",
            isVerified:true,
            isBlocked:false,
            role:'superAdmin'
        } as const

        const passwordHasher = container.resolve<IPasswordHasher>('IPasswordHasher')
        const userRepository = container.resolve<IUserRepository>('UserRepository')

        const userExits = await userRepository.findByEmail(adminData.email)
        const hashedPassword = await passwordHasher.hashPassword(adminData.password)



        if(userExits && userExits.password){
            console.log("admin already exits")
            
            const passwordMatch = await passwordHasher.comparePasswords(adminData.password,userExits?.password)
            if(!passwordMatch){
                await userRepository.update(userExits.id,{
                    password:hashedPassword
                })
                console.log("admin password updated")
                return 
            }
        }else{
            await userRepository.create({
                ...adminData,
                password:hashedPassword
            })
            console.log("admin seeded successfulyy")
        }

    } catch (error) {
        console.log("Admin seed failed - ",error)
    }
}