import { inject, injectable } from "tsyringe";
import { ICompanyService } from "./interface/ICompanyService";
import { Token } from "../../di/token";
import { ICompanyRepository } from "../../repositories/company/interface/ICompanyRepository";
import {
  IGetAllCompanyDto,
  IGetAllCompanyReponseDto,
  IRegisterCompanyDto,
} from "../../interfaces/dtos/CompanyDto";
import { companyDtoMapper } from "../../interfaces/mapper/companyDtoMapper";

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject(Token.CompanyRepository)
    private readonly _companyRepository: ICompanyRepository,
  ) {}

  async registerCompany(data: IRegisterCompanyDto): Promise<void> {
    try {
      //validate company data

      await this._companyRepository.create({
        ...data,
        isBlocked: false,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllCompany(data: IGetAllCompanyDto): Promise<{
    companies: IGetAllCompanyReponseDto[] | null;
    totalCount: number;
  }> {
    try {
      const { search, page, limit } = data;
      const skip = (page - 1) * limit;

      const [allCompany, totalCount] = await Promise.all([
        this._companyRepository.searchCompanies(search, {
          skip,
          limit,
        }),
        this._companyRepository.count(),
      ]);

      console.log("companies", allCompany);

      return {
        companies:
          allCompany?.map((c) => companyDtoMapper.toCompanyResponse(c)) || null,
        totalCount,
      };
    } catch (error) {
      throw error;
    }
  }
}
