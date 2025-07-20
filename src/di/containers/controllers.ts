import { container } from "tsyringe"
import { Token } from "../token"
import { AdminAuthController } from "../../controllers/admin/AdminAuthController"
import { PlanController } from "../../controllers/admin/PlanController"
import { AuthController } from "../../controllers/auth/AuthController"

//admin controller
container.register(Token.AdminAuthController,{
    useClass:AdminAuthController
})
container.register(Token.PlanController,{
    useClass:PlanController
})

//user controller
container.register(Token.AuthController,{
    useClass:AuthController
})
