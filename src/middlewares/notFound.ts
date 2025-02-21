import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import { errorHandler } from "./errorHandler";
import { errorResponse } from "../helper/responseHanlder";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const notFound = (req:Request,res:Response) => {
    errorResponse(res,ERROR_MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
}