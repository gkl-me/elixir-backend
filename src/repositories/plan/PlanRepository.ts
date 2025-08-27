import { injectable } from "tsyringe";
import { IPlanRepository } from "./interfaces/IPlanRepository";
import { IPlan, Plan } from "../../models/Plan";
import { BaseRepository } from "../base/BaseRepository";


@injectable()
export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository{
    constructor(){
        super(Plan)
    }
}