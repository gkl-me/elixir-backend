import { IWorkspace, Workspace } from "../../models/Workspace";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceRepository } from "./interface/IWorkspaceRepository";

export class WorkspaceRepository
  extends BaseRepository<IWorkspace>
  implements IWorkspaceRepository
{
  constructor() {
    super(Workspace);
  }
}
