import { inject, injectable } from "tsyringe";
import { ITransactionController } from "./interface/ITransactionController";
import { Token } from "../../di/token";
import { ITransactionService } from "../../services/transaction/interface/ITransactionService";
import { Request, Response, NextFunction } from "express";
import { extractStringQueryParams } from "../../helper/queryParamUtils";
import { successResponse } from "../../helper/responseHanlder";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";

@injectable()
export class TransactionController implements ITransactionController {
  constructor(
    @inject(Token.TransactionService)
    private readonly _transactionService: ITransactionService
  ) {}

  async handleListTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.query, [
        "search",
        "status",
        "page",
        "limit",
      ]);

      const processed = {
        search: params?.search || "",
        status: params?.status || "",
        page: parseInt(params?.page || "1"),
        limit: parseInt(params?.limit || "10"),
      };

      const data = await this._transactionService.listAllTransaction(processed);

      successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, data);
    } catch (error) {
      next(error);
    }
  }
}
