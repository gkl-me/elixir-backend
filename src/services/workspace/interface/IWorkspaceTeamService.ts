import {
  IAddMembersDto,
  ICreateTeamDto,
  IListTeamsDto,
  IListTeamsResDto,
  IRemoveMemberDto,
  IGetTeamDto,
  IGetTeamResDto,
} from "../../../interfaces/dtos/WorkspaceTeamDto";

export interface IWorkspaceTeamService {
  listTeams(data: IListTeamsDto): Promise<IListTeamsResDto[] | []>;
  getTeam(data: IGetTeamDto): Promise<IGetTeamResDto | null>;
  createTeam(data: ICreateTeamDto): Promise<void>;
  addMembers(data: IAddMembersDto): Promise<void>;
  removeMember(data: IRemoveMemberDto): Promise<void>;
}
