export interface IUserVerifyController {
    verifyUser(req: any, res: any): Promise<void>
}