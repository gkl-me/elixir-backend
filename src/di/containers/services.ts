import { container } from "tsyringe"
import { Token } from "../token"
// import { PlanService } from "../../services/plan/PlanService"
import { AuthService } from "../../services/auth/AuthService"
import { UserService } from "../../services/user/UserService"
import { VerifyService } from "../../services/auth/VerifyService"
import { OtpService } from "../../services/auth/OtpService"
import { PasswordService } from "../../services/auth/PasswordService"
import { PlanService } from "../../services/plan/PlanService"
import { OnboardingService } from "../../services/onboarding/OnboardingService"
// import { SubscriptionService } from "../../services/subscription/SubscriptionService"
// import { StripeWebhookService } from "../../services/webhook/StripeWebhookService"

//services
container.register(Token.AuthService,{
    useClass:AuthService
})
container.register(Token.UserService,{
    useClass:UserService
})
container.register(Token.VerifyService,{
    useClass:VerifyService
})
container.register(Token.OtpService,{
    useClass:OtpService
})
container.register(Token.PasswordService,{
    useClass:PasswordService
})
container.register(Token.PlanService,{
    useClass:PlanService
})
container.register(Token.OnboardingServive,{
    useClass:OnboardingService
})

// container.register(Token.PlanService,{
//     useClass:PlanService
// })
// container.register(Token.SubscriptionService,{
    //     useClass:SubscriptionService
    // })
    // container.register(Token.StripeWebhookService,{
        //     useClass:StripeWebhookService
        // })