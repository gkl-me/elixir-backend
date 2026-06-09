import { injectable } from "tsyringe";
import { IWorkspaceInvite, WorkspaceInvite } from "../../models/WorkspaceInvite";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceInviteRepository } from "./interface/IWorkspaceInviteRepository";


@injectable()
export class WorkspaceInviteRepository extends BaseRepository<IWorkspaceInvite> implements IWorkspaceInviteRepository {
    constructor() {
        super(WorkspaceInvite)
    }
}