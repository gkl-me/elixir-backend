import { container } from "tsyringe"
import { Token } from "../token"
import { PlanRepository } from "../../repositories/plan/PlanRepository"
import { UserRepository } from "../../repositories/user/UserRepository"
import { SubscriptionRepository } from "../../repositories/subscription/SubscriptionRepository"
import { CacheRepository } from "../../repositories/cache/CacheRepository"

//repository 
container.register(Token.PlanRepository,{
    useClass:PlanRepository
})
container.register(Token.UserRepository,{
    useClass:UserRepository
})
container.register(Token.SubscriptionRepository,{
    useClass:SubscriptionRepository
})
container.register(Token.CacheRepository,{
    useClass:CacheRepository,
})