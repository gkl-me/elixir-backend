export interface IPasswordHasher{
    hashPassword(password:string): Promise<string>
    comparePasswords(hashedPassword:string, providedPassword:string): Promise<boolean>
}