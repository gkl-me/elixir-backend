import { injectable } from "tsyringe";
import { IPasswordHasher } from "./interfaces/IPasswordHasher";
import { compare,genSalt, hash} from "bcryptjs";

@injectable()
export class PasswordHasher implements IPasswordHasher{
    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(10);
        const hashed = await hash(password, salt)
        return hashed
    }

    async comparePasswords(providedPassword: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await compare(providedPassword, hashedPassword)
        return isMatch;
    }
}