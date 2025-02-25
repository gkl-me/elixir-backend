import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ICompany } from "../../models/Company";
import { ICompanyRepository } from "../../repositories/company/interface/ICompanyRepository";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { ICompanyAuthService } from "./interfaces/ICompanyAuthService";

export class CompanyAuthService implements ICompanyAuthService{
    constructor(
        private companyRepository: ICompanyRepository,
        private passwordHasher:IPasswordHasher
    ){}

    async registerCompany(data: ICompany): Promise<ICompany | null> {
        try {

            const {email,password} = data;

            //validate company registration data

            //check if company already exists
            const existingCompany = await this.companyRepository.findByEmail(email)
            if(existingCompany) throw new CustomError('Email already exists', STATUS_CODES.CONFLICT)

            //hash password
            const hashedPassword = await this.passwordHasher.hashPassword(password)
            const newCompany = await this.companyRepository.create({...data,password:hashedPassword})

            return newCompany

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message,error.statusCode)
            }
            throw new CustomError('Failed to register company', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async loginCompany(email: string, password: string): Promise<ICompany | null> {
        try {

            //validate login data and authenticate user

            const company = await this.companyRepository.findByEmail(email)

            if(!company){
                throw new CustomError('Invalid credentails', STATUS_CODES.BAD_REQUEST)
            }

            //compare password
            const isMatch = await this.passwordHasher.comparePasswords(company.password,password)
            if(!isMatch) throw new CustomError('Invalid password', STATUS_CODES.BAD_REQUEST)

            //need to create refresh and access token for company

            return company

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message,error.statusCode)
            }
            throw new CustomError('Failed to login company', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}