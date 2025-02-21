import { Request, Response } from "express";
import { IUserAuthService } from "../../services/user/interfaces/IUserAuthService";

export class UserAuthController {
    constructor(
        private userAuthService: IUserAuthService
    ){}

    async registerUser(req:Request, res:Response){
        try {
            const { email, password, name } = req.body
            const user = await this.userAuthService.registerUser({email, password, name})
            res.status(201).json(user)
        } catch (error) {
            if(error instanceof Error)
            res.status(500).json({error: error.message})
        }
    }
}