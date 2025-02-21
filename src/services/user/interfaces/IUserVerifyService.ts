export interface IUserVerifyService{
    sendVerificationEmail(email:string,userId:string):Promise<void>
    verifyUser(token:string):Promise<void>
}