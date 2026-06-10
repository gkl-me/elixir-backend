import { inject, injectable } from "tsyringe";
import { IWorkspaceTeamRepository } from "../../repositories/workspace/interface/IWorkspaceTeamRepository";
import { Token } from "../../di/token";
import { logError } from "../../middlewares/loggerHelper";
import { workspaceTeamDtoMapper } from "../../interfaces/mapper/workspaceDtoMapper";
import { IWorkspaceTeamService } from "./interface/IWorkspaceTeamService";
import {
  IAddMembersDto,
  ICreateTeamDto,
  IGetTeamDto,
  IGetTeamResDto,
  IListTeamsDto,
  IListTeamsResDto,
  IRemoveMemberDto,
} from "../../interfaces/dtos/WorkspaceTeamDto";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";

@injectable()
export class WorkspaceTeamService implements IWorkspaceTeamService {
  constructor(
    @inject(Token.WorkspaceTeamRepository)
    private readonly _workspaceTeamRepository: IWorkspaceTeamRepository
  ) {}

  async listTeams(data: IListTeamsDto): Promise<IListTeamsResDto[] | []> {
    try {
      const { workspaceId } = data;

      const teams = await this._workspaceTeamRepository.listTeams(workspaceId);

      return teams.length ? teams.map(workspaceTeamDtoMapper.toListTeams) : [];
    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamService.listTeams",
      });
      throw error;
    }
  }

  async createTeam(data: ICreateTeamDto): Promise<void> {
    try {
      const { workspaceId, name, description, memberIds, createdByUserId } =
        data;

      await this._workspaceTeamRepository.create({
        workspaceId,
        name,
        description,
        memberIds,
        createdByUserId,
      });
    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamService.createTeam",
      });
      throw error;
    }
  }

  async addMembers(data: IAddMembersDto): Promise<void> {
    try {
      const { teamId, memberIds, workspaceId } = data;

      const team = await this._workspaceTeamRepository.findById(teamId);
      if (!team || team.workspaceId !== workspaceId) {
        throw new CustomError("Team not found", STATUS_CODES.BAD_REQUEST);
      }

      team.memberIds = [...team.memberIds, ...memberIds];
      await team.save();
    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamService.addMembers",
      });
      throw error;
    }
  }

  async removeMember(data: IRemoveMemberDto): Promise<void> {
    try {
      const { teamId, memberId, workspaceId } = data;

      const team = await this._workspaceTeamRepository.findById(teamId);
      if (!team || team.workspaceId !== workspaceId) {
        throw new CustomError("Team not found", STATUS_CODES.BAD_REQUEST);
      }

      const filteredMembers = team.memberIds.filter((mem) => mem !== memberId);
      team.memberIds = filteredMembers;
      await team.save();
    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamService.removeMember",
      });
      throw error;
    }
  }

  async getTeam(data: IGetTeamDto): Promise<IGetTeamResDto | null> {
    try {
      const { workspaceId, teamId } = data;

      const teamMembers = await this._workspaceTeamRepository.listTeamMembers(
        workspaceId,
        teamId
      );
      if (!teamMembers) {
        throw new CustomError("Team not found", STATUS_CODES.BAD_REQUEST);
      }

      return workspaceTeamDtoMapper.toGetTeam(teamMembers);
    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamService.getTeam",
      });
      throw error;
    }
  }
}
