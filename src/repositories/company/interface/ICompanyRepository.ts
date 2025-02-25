import { ICompany } from "../../../models/Company";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface ICompanyRepository extends IBaseRepository<ICompany>{
    findByEmail(email:string):Promise<ICompany | null>
}