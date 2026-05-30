import { ICompany } from "../../../models/Company";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface ICompanyRepository extends IBaseRepository<ICompany> {
  searchCompanies(
    search?: string,
    options?: {
      skip?: number;
      limit?: number;
    }
  ): Promise<ICompany[]>;
}
