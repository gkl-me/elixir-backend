import { FilterQuery, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { IPlan } from "../../../models/Plan";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IPlanRepository extends IBaseRepository<IPlan> {
  updateMany(
    filter: FilterQuery<IPlan>,
    update: UpdateQuery<IPlan>
  ): Promise<UpdateWriteOpResult>;
}
