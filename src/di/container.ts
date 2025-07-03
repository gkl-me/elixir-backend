import { container } from "tsyringe";
import { Token } from "./token";
import { PasswordHasher } from "../utils/PasswordHasher";


//password hasher
container.register(Token.PasswordHasher,{
    useClass:PasswordHasher
})