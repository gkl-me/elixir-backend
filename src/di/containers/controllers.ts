import { container } from "tsyringe"
import { Token } from "../token"
import { AdminAuthController } from "../../controllers/admin/AdminAuthController"
import { PlanController } from "../../controllers/plan/PlanController"
import { AuthController } from "../../controllers/auth/AuthController"
import { SubscriptionController } from "../../controllers/subscription/SubscriptionController"
import { UserController } from "../../controllers/user/UserController"
import { StripeWebhookController } from "../../controllers/webhook/StripeWebhook"

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
container.register(Token.SubscriptionController,{
    useClass:SubscriptionController
})
container.register(Token.UserController,{
    useClass:UserController  
})
container.register(Token.StripeWebhookController,{
    useClass:StripeWebhookController
})