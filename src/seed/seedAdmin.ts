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

        const adminExists = await Admin.findOne({email:adminData.email})
        if(adminExists){
            console.log("admin already exits")
            return
        }

        const passwordHasher = container.resolve<IPasswordHasher>('IPasswordHasher')
        const hashedPassword = await passwordHasher.hashPassword(adminData.password)
        adminData.password = hashedPassword

        await Admin.create(adminData)

        console.log("admin seeded successfulyy")

    } catch (error) {
        console.log("Admin seed failed - ",error)
    }
}