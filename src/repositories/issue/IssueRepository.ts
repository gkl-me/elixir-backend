import { injectable } from "tsyringe";
import { IIssue, issue } from "../../models/Issue";
import { BaseRepository } from "../base/BaseRepository";
import { IIssueRepository } from "./interface/IIssueRepository";




@injectable()
export class IssueRepository extends BaseRepository<IIssue> implements IIssueRepository {
    constructor(
    ) {
        super(issue)
    }
}