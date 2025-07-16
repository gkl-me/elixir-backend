import { NextFunction, Request, Response } from "express";

export interface IUserVerifyController {
    verifyUser(req: Request, res: Response,next:NextFunction): Promise<void>
}