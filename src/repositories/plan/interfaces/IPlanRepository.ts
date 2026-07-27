import { FilterQuery, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { IPlan } from "../../../models/Plan";
import { IBaseRepository } from "../../base/interface/IBaseRepository";

export interface IPlanRepository extends IBaseRepository<IPlan> {
  updateMany(
    filter: FilterQuery<IPlan>,
    update: UpdateQuery<IPlan>
  ): Promise<UpdateWriteOpResult>;
}
