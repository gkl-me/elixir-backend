import {
  IGetAllCompanyDto,
  IGetAllCompanyReponseDto,
  IRegisterCompanyDto,
} from "../../../interfaces/dtos/CompanyDto";

export interface ICompanyService {
  registerCompany(data: IRegisterCompanyDto): Promise<void>;
  getAllCompany(data: IGetAllCompanyDto): Promise<{
    companies: IGetAllCompanyReponseDto[] | null;
    totalCount: number;
  }>;
}
