import {z} from 'zod'

export const UserRegisterSchema = z.object({
    name: z.string().min(3,"Name should be mininum three characters").max(100,"Name cannot be more than 100 characters"),
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8,"Password should be min 8 characters long").max(100)
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)")
}) 


export const UserLoginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8,"Password should be min 8 characters long").max(100)
})