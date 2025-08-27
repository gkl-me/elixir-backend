import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import { errorResponse } from "../helper/responseHanlder";
import { CONSTANT_MESSAGES, } from "../constants/messages";

export const notFound = (req:Request,res:Response) => {
    errorResponse(res,CONSTANT_MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
}