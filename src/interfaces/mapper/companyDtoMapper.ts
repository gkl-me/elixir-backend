import { ICompany } from "../../models/Company";
import { IGetAllCompanyReponseDto } from "../dtos/CompanyDto";

export class companyDtoMapper {
  static toCompanyResponse(company: ICompany): IGetAllCompanyReponseDto {
    return {
      id: String(company._id),
      name: company.name,
      type: company.type,
      size: company.size,
      email: company.email,
      phone: company.phone,
      website: company?.website,
      isBlocked: company.isBlocked,
      createdAt: company.createdAt,
    };
  }
}
