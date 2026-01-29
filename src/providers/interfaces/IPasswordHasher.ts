export interface IPasswordHasher{
    hashPassword(password:string): Promise<string>
    comparePasswords(providedPassword: string, hashedPassword: string): Promise<boolean>
}