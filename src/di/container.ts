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
import { EmailService } from "../utils/EmailService";
import { UserRepository } from "../repositories/user/UserRepository";
import { UserVerifyService } from "../services/user/UserVerifyService";
import { UserAuthService } from "../services/user/UserAuthService";
import { UserAuthController } from "../controllers/user/UserAuthController";
import { UserVerifyController } from "../controllers/user/UserVerifyController";


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
container.register(Token.EmailService,{
    useClass:EmailService
})


//repository 
container.register(Token.PlanRepository,{
    useClass:PlanRepository
})
container.register(Token.UserRepository,{
    useClass:UserRepository
})


//services
container.register(Token.AdminAuthService,{
    useClass:AdminAuthService
})
container.register(Token.PlanService,{
    useClass:PlanService
})
container.register(Token.UserVerifyService,{
    useClass:UserVerifyService
})
container.register(Token.UserAuthService,{
    useClass:UserAuthService
})




//admin controller
container.register(Token.AdminAuthController,{
    useClass:AdminAuthController
})
container.register(Token.PlanController,{
    useClass:PlanController
})

//user controller
container.register(Token.UserAuthController,{
    useClass:UserAuthController
})
container.register(Token.UserVerifyController,{
    useClass:UserVerifyController
})