import { injectable } from "tsyringe";
import {
  IWorkspaceMember,
  WorkspaceMember,
} from "../../models/WorkspaceMember";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceMemberRepository } from "./interface/IWorkspaceMemberRepository";

@injectable()
export class WorkspaceMemberRepository
  extends BaseRepository<IWorkspaceMember>
  implements IWorkspaceMemberRepository {
  constructor() {
    super(WorkspaceMember);
  }
}
