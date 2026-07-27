import {
  IGetAllCompanyDto,
  IGetAllCompanyReponseDto,
  IRegisterCompanyDto,
  IToggleCompanyStatus,
} from "../../../interfaces/dtos/CompanyDto";

export interface ICompanyService {
  registerCompany(data: IRegisterCompanyDto): Promise<void>;
  getAllCompany(data: IGetAllCompanyDto): Promise<{
    companies: IGetAllCompanyReponseDto[] | null;
    totalCount: number;
  }>;
  toggleCompanyStatus(data: IToggleCompanyStatus): Promise<void>
}
