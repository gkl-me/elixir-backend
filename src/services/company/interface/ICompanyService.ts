import { IRegisterCompanyDto } from "../../../interfaces/dtos/CompanyDto";



export interface ICompanyService{
    registerCompany(data:IRegisterCompanyDto):Promise<void>
}