import { NextFunction, Request, Response } from "express";


export interface ITransactionController {
    handleListTransactions(req: Request, res: Response, next: NextFunction): Promise<void>
}