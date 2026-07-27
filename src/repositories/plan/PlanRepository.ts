import { injectable } from "tsyringe";
import { IPlanRepository } from "./interfaces/IPlanRepository";
import { IPlan, Plan } from "../../models/Plan";
import { BaseRepository } from "../base/BaseRepository";
import { FilterQuery, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import logger from "../../middlewares/logger";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";

@injectable()
export class PlanRepository
  extends BaseRepository<IPlan>
  implements IPlanRepository
{
  constructor() {
    super(Plan);
  }

  async updateMany(
    filter: FilterQuery<IPlan>,
    update: UpdateQuery<IPlan>
  ): Promise<UpdateWriteOpResult> {
    try {
      return await this._model.updateMany(filter, update);
    } catch (error) {
      logger.error("Mongodb update many error", error);
      throw new CustomError(
        `Failed to update many ${this._model.modelName}`,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
