import { container } from "tsyringe"
import { Token } from "../token"
import { AdminAuthService } from "../../services/admin/AdminAuthService"
import { PlanService } from "../../services/plan/PlanService"
import { AuthService } from "../../services/auth/AuthService"

//services
container.register(Token.AdminAuthService,{
    useClass:AdminAuthService
})
container.register(Token.PlanService,{
    useClass:PlanService
})
container.register(Token.AuthService,{
    useClass:AuthService
})