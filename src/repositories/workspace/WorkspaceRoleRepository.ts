import { injectable } from "tsyringe";
import { IWorkspaceRole, WorkspaceRole } from "../../models/WorkspaceRole";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceRoleRepository } from "./interface/IWorkspaceRoleRepository";

@injectable()
export class WorkspaceRoleRepository
  extends BaseRepository<IWorkspaceRole>
  implements IWorkspaceRoleRepository
{
  constructor() {
    super(WorkspaceRole);
  }
}
