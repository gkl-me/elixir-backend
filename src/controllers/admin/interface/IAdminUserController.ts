import { Request, Response } from "express";

export interface IAdminUserController {
    getAllUsers(req:Request,res:Response):Promise<void>
    blockUser(req:Request,res:Response):Promise<void>
}