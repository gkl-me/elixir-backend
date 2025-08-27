import { container } from "tsyringe"
import { Token } from "../token"
import { PasswordHasher } from "../../utils/PasswordHasher"
import { TokenManager } from "../../utils/TokenManager"
import { StripeService } from "../../utils/StripeService"
import { EmailService } from "../../utils/EmailService"

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
