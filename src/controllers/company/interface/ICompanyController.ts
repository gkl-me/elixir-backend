import { NextFunction, Request, Response } from "express";

export interface ICompanyController {
  handleGetAllCompany(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
