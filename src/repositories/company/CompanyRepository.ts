import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { logError } from "../../middlewares/loggerHelper";
import { Company, ICompany } from "../../models/Company";
import { BaseRepository } from "../base/BaseRepository";
import { ICompanyRepository } from "./interface/ICompanyRepository";

export class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  constructor() {
    super(Company);
  }

  async searchCompanies(
    search?: string,
    options?: { skip?: number; limit?: number }
  ): Promise<ICompany[]> {
    try {
      let query = this._model.find(
        search ? { name: { $regex: search, $options: "i" } } : {}
      );

      if (options?.limit !== undefined) {
        query = query.limit(options?.limit);
      }

      if (options?.skip !== undefined) {
        query = query.skip(options?.skip);
      }

      return query.exec();
    } catch (error) {
      logError(error, {
        service: "CompanyRepository.searchCompanies",
      });
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
