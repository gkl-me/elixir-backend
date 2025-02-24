import { Request, Response } from "express";

export interface IUserAuthController {
    registerUser(req:Request,res:Response):Promise<void>,
    loginUser(req:Request,res:Response):Promise<void>
}