import {
  ICreateWorkspaceDto,
  IListAllWorkspaceDto,
  IListAllWorkspaceResDto,
  IToggleWorkspaceStatusDto,
  IWorkpsaceContextDto,
  IWorksapceLimitsResDto,
  IWorkspaceBootstrapDto,
  IWorkspaceContextResDto,
  IWorkspaceLimitsDto,
  IWorkspaceResDto,
} from "../../../interfaces/dtos/WorkspaceDto";
import { IWorkspace } from "../../../models/Workspace";

export interface IWorkspaceService {
  createWorkspace(data: ICreateWorkspaceDto): Promise<IWorkspace>;
  bootStrapWorkspace(data: IWorkspaceBootstrapDto): Promise<IWorkspaceResDto>;
  workspaceContext(
    data: IWorkpsaceContextDto
  ): Promise<IWorkspaceContextResDto>;
  workspaceLimits(data: IWorkspaceLimitsDto): Promise<IWorksapceLimitsResDto>;
  listAllWorkspace(
    data: IListAllWorkspaceDto
  ): Promise<IListAllWorkspaceResDto>;
  toggleWorkspaceStatus(data: IToggleWorkspaceStatusDto): Promise<void>;
}
