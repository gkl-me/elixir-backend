import { inject, injectable } from "tsyringe";
import { IWorkspaceMemberService } from "./interface/IWorkspaceMemberService";
import { IWorkspaceMemberRepository } from "../../repositories/workspace/interface/IWorkspaceMemberRepository";
import { logError } from "../../middlewares/loggerHelper";
import { workspaceMemberDtoMapper } from "../../interfaces/mapper/workspaceDtoMapper";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { Token } from "../../di/token";
import { IWorkspaceRoleRepository } from "../../repositories/workspace/interface/IWorkspaceRoleRepository";
import {
  IListMemberDto,
  IListMemberResDto,
  IRemoveMemberDto,
  IUpdateMemberDto,
} from "../../interfaces/dtos/WorkspaceMemberDto";

@injectable()
export class WorkspaceMemberService implements IWorkspaceMemberService {
  constructor(
    @inject(Token.WorkspaceMemberRepository)
    private readonly _workspaceMemberRepository: IWorkspaceMemberRepository,
    @inject(Token.WorkspaceRoleRepository)
    private readonly _workspaceRoleRepository: IWorkspaceRoleRepository
  ) {}

  async listMember(data: IListMemberDto): Promise<IListMemberResDto[] | []> {
    try {
      const { workspaceId } = data;

      const members =
        await this._workspaceMemberRepository.listMembers(workspaceId);

      console.log("ser", members);

      return members.length
        ? members.map((mem) => workspaceMemberDtoMapper.toListMembers(mem))
        : [];
    } catch (error) {
      logError(error, {
        service: "WorkspaceMemberService.listMember",
      });
      throw error;
    }
  }
  async updateMemberRole(data: IUpdateMemberDto): Promise<void> {
    try {
      const { workspaceId, memberId, roleId } = data;

      const existingMember =
        await this._workspaceMemberRepository.findById(memberId);
      if (
        !existingMember ||
        existingMember.workspaceId.toString() !== workspaceId
      ) {
        throw new CustomError("Member not found", STATUS_CODES.NOT_FOUND);
      }

      const existingRole = await this._workspaceRoleRepository.findById(
        String(existingMember.roleId)
      );
      if (!existingRole || existingRole.key === "owner") {
        throw new CustomError(
          "You cannot change owner's role",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const newRole = await this._workspaceRoleRepository.findById(
        String(roleId)
      );
      if (!newRole || newRole.workspaceId.toString() !== workspaceId) {
        throw new CustomError("Role not found", STATUS_CODES.BAD_REQUEST);
      }

      existingMember.roleId = roleId;
      await existingMember.save();
    } catch (error) {
      logError(error, {
        service: "WorkspaceMemberService.updateMemberRole",
      });
      throw error;
    }
  }

  async removeMember(data: IRemoveMemberDto): Promise<void> {
    try {
      const { workspaceId, memberId } = data;

      const existingMember =
        await this._workspaceMemberRepository.findById(memberId);
      if (!existingMember || existingMember.workspaceId !== workspaceId) {
        throw new CustomError("Member not found", STATUS_CODES.NOT_FOUND);
      }

      const existingRole = await this._workspaceRoleRepository.findById(
        existingMember.roleId
      );
      if (!existingRole || existingRole.key === "owner") {
        throw new CustomError(
          "You cannot remove owner",
          STATUS_CODES.BAD_REQUEST
        );
      }

      existingMember.isRemoved = true;
      await existingMember.save();
    } catch (error) {
      logError(error, {
        service: "WorkspaceMemberService.removeMember",
      });
      throw error;
    }
  }
}
