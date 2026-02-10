import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import logger from "../../middlewares/logger";

export class BaseRepository<T extends Document> implements IBaseRepository<T>{

    constructor(
        protected _model:Model<T>
    ){}

    async create(data: Partial<T>): Promise<T> {
        try {
            
            const created = await this._model.create(data)

            return created

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Unable to create new ${this._model.modelName}`, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findAll(
        data: FilterQuery<T>,
        options?:{
            sort?:Record<string,1|-1>,
            limit?:number,
            skip?:number,
        }
    ): Promise<T[] | null> {
        try {
            let allData =  this._model.find(data)

            const sortOptions: Record<string, 1 | -1> = options?.sort ?? {};

            if(options?.sort){
                allData = allData.sort({
                    ...sortOptions,
                    "createdAt":-1
                })
            }else{
                allData = allData.sort({"createdAt":-1})
            }

            if(options?.limit){
                allData = allData.limit(options.limit)
            }

            if(options?.skip){
                allData = allData.skip(options.skip)
            }

            return await allData
            
        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to get all ${this._model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne(data: FilterQuery<T>): Promise<T | null> {
        try {
            
            const foundData = await this._model.findOne(data);
            return foundData

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to get ${this._model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async findById(id: string): Promise<T | null> {
        try {
            
            const foundData = await this._model.findById(id);
            return foundData

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to find ${this._model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            
            const updatedData = await this._model.findByIdAndUpdate(id,data, { new: true });
            return updatedData

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to update ${this._model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async delete(id: string,data:UpdateQuery<T>): Promise<T | null> {
        try {
            
            const deletedCount = await this._model.findByIdAndUpdate(id,data,{new:true})
            return deletedCount

        } catch (error) {
            logger.error(error)
            throw new CustomError(`Failed to delete ${this._model.modelName}`,STATUS_CODES.INTERNAL_SERVER_ERROR)
            
        }
    }

}