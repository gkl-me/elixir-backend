import { container } from "tsyringe"
import { Admin } from "../models/Admin"
import { IPasswordHasher } from "../utils/interfaces/IPasswordHasher"


export async function seedAdmin(){
    try {
        const adminData = {
            name:'admin',
            email:process.env.ADMIN_EMAIL || "",
            password:process.env.ADMIN_PASSWORD || "",
        }

        const passwordHasher = container.resolve<IPasswordHasher>('IPasswordHasher')
        const adminExists = await Admin.findOne({email:adminData.email})

        if(adminExists){
            console.log("admin already exits")
            
            const passwordMatch = await passwordHasher.comparePasswords(adminData.password,adminExists.password)
            if(!passwordMatch){
                const hashedPassword = await passwordHasher.hashPassword(adminData.password)
                await Admin.findByIdAndUpdate(adminExists.id,{password:hashedPassword})
                console.log("admin password updated")

                return 
            }
        }

        const hashedPassword = await passwordHasher.hashPassword(adminData.password)
        adminData.password = hashedPassword

        await Admin.create(adminData)

        console.log("admin seeded successfulyy")

    } catch (error) {
        console.log("Admin seed failed - ",error)
    }
}