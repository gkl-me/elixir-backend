import { container } from "tsyringe";
import { Token } from "./token";
import { PasswordHasher } from "../utils/PasswordHasher";
import { TokenManager } from "../utils/TokenManager";
import { AdminAuthService } from "../services/admin/AdminAuthService";
import { AdminAuthController } from "../controllers/admin/AdminAuthController";
import { StripeService } from "../utils/StripeService";
import { PlanService } from "../services/admin/PlanService";
import { PlanController } from "../controllers/admin/PlanController";
import { PlanRepository } from "../repositories/admin/PlanRepository";


//utils
container.register(Token.PasswordHasher,{
    useClass:PasswordHasher
})
container.register(Token.TokenManager,{
    useClass:TokenManager
})
container.register(Token.StripeService,{
    useClass:StripeService
})

//repository 
container.register(Token.PlanRepository,{
    useClass:PlanRepository
})

//services
container.register(Token.AdminAuthService,{
    useClass:AdminAuthService
})
container.register(Token.PlanService,{
    useClass:PlanService
})




container.register(Token.AdminAuthController,{
    useClass:AdminAuthController
})
container.register(Token.PlanController,{
    useClass:PlanController
})