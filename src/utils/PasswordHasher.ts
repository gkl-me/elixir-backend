import { IPasswordHasher } from "./interfaces/IPasswordHasher";
import { hash,compare,genSalt} from "bcryptjs";

export class PasswordHasher implements IPasswordHasher{
    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(10);
        const hashed = await hash(password, salt)
        return hashed
    }

    async comparePasswords(hashedPassword: string, providedPassword: string): Promise<boolean> {
        const isMatch = await compare(providedPassword, hashedPassword)
        return isMatch;
    }
}