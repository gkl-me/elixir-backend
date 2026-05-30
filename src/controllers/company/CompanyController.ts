import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { ICompanyService } from "../../services/company/interface/ICompanyService";
import { ICompanyController } from "./interface/ICompanyController";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class CompanyController implements ICompanyController {
  constructor(
    @inject(Token.CompanyService) private _companyService: ICompanyService
  ) {}

  async handleGetAllCompany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.query, [
        "search",
        "page",
        "limit",
      ]);

      const proccessParams = {
        search: params?.search ?? "",
        page: parseInt(params?.page || "1"),
        limit: parseInt(params?.limit || "10"),
      };

      const { companies, totalCount } =
        await this._companyService.getAllCompany(proccessParams);

      successResponse(
        res,
        "Company list successfull fetched",
        STATUS_CODES.OK,
        {
          companies,
          totalCount,
        }
      );
    } catch (error) {
      next(error);
    }
  }
}
