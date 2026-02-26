import { inject, injectable } from "tsyringe";
import { ICompanyService } from "./interface/ICompanyService";
import { Token } from "../../di/token";
import { ICompanyRepository } from "../../repositories/company/interface/ICompanyRepository";
import { IRegisterCompanyDto } from "../../interfaces/dtos/CompanyDto";



@injectable()
export class CompanyService implements ICompanyService{
    constructor(
        @inject(Token.CompanyRepository) private readonly _companyRepository:ICompanyRepository
    ){}

    async registerCompany(data:IRegisterCompanyDto):Promise<void>{
        try {

            //validate company data

            await this._companyRepository.create({
                ...data,
                isBlocked:false
            })
            
        } catch (error) {
            throw error
        }
    }
}