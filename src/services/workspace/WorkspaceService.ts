import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "./interface/IWorkspaceService";
import { Token } from "../../di/token";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";
import { IWorkspace } from "../../models/Workspace";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject(Token.WorkspaceRepository)
    private readonly _workspaceRepository: IWorkspaceRepository,
  ) {}

  async createWorkspace({
    name,
    ownerId,
    companyId,
    subscriptionId,
  }: {
    name: string;
    ownerId: string;
    companyId?: string;
    subscriptionId?: string;
  }): Promise<IWorkspace> {
    try {
      const workspace = await this._workspaceRepository.create({
        name,
        ownerId,
        companyId,
        subscriptionId,
      });

      return workspace;
    } catch (error) {
      throw error;
    }
  }
}
