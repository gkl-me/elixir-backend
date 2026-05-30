import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import logger from "../../middlewares/logger";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected _model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const created = await this._model.create(data);

      return created;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Unable to create new ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const created = await this._model.insertMany(data, {
        ordered: true,
      });
      return created as unknown as T[];
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Unable to create many entires ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(
    data: FilterQuery<T>,
    options?: {
      sort?: Record<string, 1 | -1>;
      limit?: number;
      skip?: number;
    }
  ): Promise<T[] | null> {
    try {
      let query = this._model.find(data);

      if (options?.sort) {
        query = query.sort(options.sort);
      } else {
        query = query.sort({ createdAt: -1 });
      }

      if (options?.limit !== undefined) {
        query = query.limit(options.limit);
      }

      if (options?.skip !== undefined) {
        query = query.skip(options.skip);
      }

      return query.exec();
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Failed to get all ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(data: FilterQuery<T>): Promise<T | null> {
    try {
      const foundData = await this._model.findOne(data);
      return foundData;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Failed to get ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const foundData = await this._model.findById(id);
      return foundData;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Failed to find ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      const updatedData = await this._model.findByIdAndUpdate(id, data, {
        new: true,
      });
      return updatedData;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Failed to update ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async delete(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      const deletedCount = await this._model.findByIdAndUpdate(id, data, {
        new: true,
      });
      return deletedCount;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Failed to delete ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async count(): Promise<number> {
    try {
      const count = await this._model.countDocuments();
      return count;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        `Failed to count ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
