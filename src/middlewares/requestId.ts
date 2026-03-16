import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.requestId = uuid();
  res.setHeader("X-Request-Id", req.requestId);
  next();
};
