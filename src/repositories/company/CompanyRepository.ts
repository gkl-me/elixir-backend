import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { Company, ICompany } from "../../models/Company";
import { BaseRepository } from "../base/BaseRepository";
import { ICompanyRepository } from "./interface/ICompanyRepository";


export class CompanyRepository extends BaseRepository<ICompany> implements ICompanyRepository {
    constructor(){
        super(Company)
    }

    async findByEmail(email: string): Promise<ICompany | null> {
        try {

            return this.model.findOne({email});

        } catch (error) {
            throw new CustomError('Failed to find company by email',STATUS_CODES.INTERNAL_SERVER_ERROR)   
        }
    }
}