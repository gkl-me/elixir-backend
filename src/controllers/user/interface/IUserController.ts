import { NextFunction, Request, Response } from "express";

export interface IUserController{
    getAllUsers(req:Request,res:Response,next:NextFunction):Promise<void>;
    toggleBlockStatus(req:Request,res:Response,next:NextFunction):Promise<void>
    handleChangePassword(req:Request,res:Response,next:NextFunction):Promise<void>
    handleListActiveSessions(req:Request,res:Response,next:NextFunction):Promise<void>
}