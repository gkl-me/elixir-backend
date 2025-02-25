import { ICompany } from "../../../models/Company";

export interface ICompanyAuthService{
    registerCompany(data:ICompany):Promise<ICompany|null>
    loginCompany(email:string, password:string):Promise<ICompany|null>
}