import { Request, Response } from "express";

export interface IUserVerifyController {
    verifyUser(req: Request, res: Response): Promise<void>
}