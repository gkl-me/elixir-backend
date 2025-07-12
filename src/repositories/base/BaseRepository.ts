import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import logger from "../../middlewares/logger";

export class BaseRepository<T extends Document> implements IBaseRepository<T>{

    constructor(
        protected model:Model<T>
    ){}

    async create(data: Partial<T>): Promise<T> {
        try {
            
            const created = await this.model.create(data)

            return created

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Unable to create new ${this.model.modelName}`, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findAll(data: FilterQuery<T>): Promise<T[] | null> {
        try {

            const allData = await this.model.find(data)
            return allData
            
        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to get all ${this.model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne(data: FilterQuery<T>): Promise<T | null> {
        try {
            
            const foundData = await this.model.findOne(data);
            return foundData

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to get ${this.model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            
            const foundData = await this.model.findById(id);
            return foundData

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to find ${this.model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            
            const updatedData = await this.model.findByIdAndUpdate(id,data, { new: true });
            return updatedData

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to update ${this.model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async delete(id: string,data:UpdateQuery<T>): Promise<T | null> {
        try {
            
            const deletedCount = await this.model.findByIdAndUpdate(id,data,{new:true})
            return deletedCount

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to delete ${this.model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
            
        }
    }

}