import { Company, ICompany } from "../../models/Company";
import { BaseRepository } from "../base/BaseRepository";



export class CompanyRepository extends BaseRepository<ICompany> implements CompanyRepository{
    constructor(){
        super(Company)
    }
}