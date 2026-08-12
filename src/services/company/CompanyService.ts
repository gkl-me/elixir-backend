import { inject, injectable } from "tsyringe";
import { ICompanyService } from "./interface/ICompanyService";
import { Token } from "../../di/token";
import { ICompanyRepository } from "../../repositories/company/interface/ICompanyRepository";
import {
  IGetAllCompanyDto,
  IGetAllCompanyReponseDto,
  IRegisterCompanyDto,
  IToggleCompanyStatus,
} from "../../interfaces/dtos/CompanyDto";
import { companyDtoMapper } from "../../interfaces/mapper/companyDtoMapper";
import { logError } from "../../middlewares/loggerHelper";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";
import { CustomError } from "../../errors/CustomError";
import { COMPANY_MESSAGES, WORKSPACE_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject(Token.CompanyRepository)
    private readonly _companyRepository: ICompanyRepository,
    @inject(Token.WorkspaceRepository)
    private readonly _workspaceRepository: IWorkspaceRepository
  ) {}

  async registerCompany(data: IRegisterCompanyDto): Promise<void> {
    try {
      //validate company data

      await this._companyRepository.create({
        ...data,
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
      const { search, page, limit, status } = data;
      const skip = (page - 1) * limit;

      const [allCompany, totalCount] = await Promise.all([
        this._companyRepository.searchCompanies(search, status, {
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

  async toggleCompanyStatus(data: IToggleCompanyStatus): Promise<void> {
    try {
      const { companyId } = data;

      const company = await this._companyRepository.findById(companyId);

      if (!company) {
        throw new CustomError(
          COMPANY_MESSAGES.NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );
      }
      company.status = company?.status === "active" ? "suspended" : "active";

      //need to disable workspace
      const workspace = await this._workspaceRepository.findOne({
        companyId,
      });

      if (!workspace) {
        throw new CustomError(
          WORKSPACE_MESSAGES.NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );
      }

      workspace.status =
        workspace?.status === "active" ? "suspended" : "active";

      await company.save();
      await workspace.save();
    } catch (error) {
      logError(error, {
        service: "CompanyService.suspendCompany",
      });
      throw error;
    }
  }
}
