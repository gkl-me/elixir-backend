import { container } from "tsyringe"
import { Token } from "../token"
import { PlanRepository } from "../../repositories/plan/PlanRepository"
import { UserRepository } from "../../repositories/user/UserRepository"

//repository 
container.register(Token.PlanRepository,{
    useClass:PlanRepository
})
container.register(Token.UserRepository,{
    useClass:UserRepository
})