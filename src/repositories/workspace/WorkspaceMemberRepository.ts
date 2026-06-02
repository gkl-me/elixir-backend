import {
  IWorkspaceMember,
  WorkspaceMember,
} from "../../models/WorkspaceMember";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceMemberRepository } from "./interface/IWorkspaceMemberRepository";

export class WorkspaceMemberRepository
  extends BaseRepository<IWorkspaceMember>
  implements IWorkspaceMemberRepository
{
  constructor() {
    super(WorkspaceMember);
  }
}
