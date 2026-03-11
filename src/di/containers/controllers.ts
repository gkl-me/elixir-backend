import { container } from "tsyringe"
import { Token } from "../token"
// import { PlanController } from "../../controllers/plan/PlanController"
import { AuthController } from "../../controllers/auth/AuthController"
// import { SubscriptionController } from "../../controllers/subscription/SubscriptionController"
import { UserController } from "../../controllers/user/UserController"
import { VerifyController } from "../../controllers/auth/VerifyController"
import { OtpController } from "../../controllers/auth/OtpController"
import { PasswordController } from "../../controllers/auth/PasswordController"
import { PlanController } from "../../controllers/plan/PlanController"
import { OnboardingController } from "../../controllers/onboarding/OnboardingController"
import { PaymentController } from "../../controllers/payment/PaymenController"
import { StripeWebhookController } from "../../controllers/webhook/StripeWebhook"
// import { StripeWebhookController } from "../../controllers/webhook/StripeWebhook"



// container.register(Token.PlanController,{
//     useClass:PlanController
// })

//user controller
container.register(Token.AuthController,{
    useClass:AuthController
})
container.register(Token.UserController,{
    useClass:UserController  
})
container.register(Token.VerifyController,{
    useClass:VerifyController
})
container.register(Token.OtpController,{
    useClass:OtpController
})
container.register(Token.PasswordController,{
    useClass:PasswordController
})
container.register(Token.PlanController,{
    useClass:PlanController
})
container.register(Token.OnboardingController,{
    useClass:OnboardingController
})
container.register(Token.PaymentController,{
    useClass:PaymentController
})
container.register(Token.StripeWebhookController,{
    useClass:StripeWebhookController
})


// container.register(Token.SubscriptionController,{
//     useClass:SubscriptionController
// })