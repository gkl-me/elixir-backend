import { container } from "tsyringe"
import { Token } from "../token"
import { AdminAuthService } from "../../services/admin/AdminAuthService"
import { PlanService } from "../../services/plan/PlanService"
import { AuthService } from "../../services/auth/AuthService"
import { SubscriptionService } from "../../services/subscription/SubscriptionService"
import { UserService } from "../../services/user/UserService"
import { StripeWebhookService } from "../../services/webhook/StripeWebhookService"

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
container.register(Token.SubscriptionService,{
    useClass:SubscriptionService
})
container.register(Token.UserService,{
    useClass:UserService
})
container.register(Token.StripeWebhookService,{
    useClass:StripeWebhookService
})