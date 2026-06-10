import { inject, injectable } from "tsyringe";
import { IWorkspaceRoleService } from "./interface/IWorkspaceRoleService";
import {
  ICreateRoleDto,
  ICreateRoleResDto,
  IDeleteRoleDto,
  IGetRolesDto,
  IGetRolesResDto,
  IUpdateRoleDto,
  IUpdateRoleResDto,
} from "../../interfaces/dtos/WorkspaceRoleDto";
import { logError } from "../../middlewares/loggerHelper";
import { Token } from "../../di/token";
import { IWorkspaceRoleRepository } from "../../repositories/workspace/interface/IWorkspaceRoleRepository";
import { workspaceRoleDtoMapper } from "../../interfaces/mapper/workspaceDtoMapper";
import { resolveDependencies } from "../../helper/permissionResolver";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspacePermissions";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CONSTANT_MESSAGES } from "../../constants/messages";

@injectable()
export class WorkspaceRoleService implements IWorkspaceRoleService {
  constructor(
    @inject(Token.WorkspaceRoleRepository)
    private readonly _workspaceRoleRepository: IWorkspaceRoleRepository
  ) {}

  async getRoles(data: IGetRolesDto): Promise<IGetRolesResDto[] | []> {
    try {
      const { workspaceId } = data;

      const roles = await this._workspaceRoleRepository.findAll({
        workspaceId,
        isDeleted: false,
      });

      return roles
        ? roles?.map((r) => workspaceRoleDtoMapper.toGetRoles(r))
        : [];
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.getRole",
      });
      throw error;
    }
  }

  async createRole(data: ICreateRoleDto): Promise<ICreateRoleResDto> {
    try {
      const { permissions, workspaceId, name, createdByUserId } = data;

      const resolved = resolveDependencies(permissions);

      const valid = Object.values(WORKSPACE_PERMISSIONS);
      const invalid = resolved.filter((p) => !valid.includes(p));

      if (!invalid) {
        throw new CustomError("Unknown permissions", STATUS_CODES.BAD_REQUEST);
      }

      const roles = await this._workspaceRoleRepository.create({
        workspaceId,
        name,
        permissions: resolved,
        createdByUserId,
        key: name.toLowerCase().trim(),
        isEditable: true,
        isDeletable: true,
        isDeleted: false,
      });

      return roles;
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.getRole",
      });
      throw error;
    }
  }

  async updateRole(data: IUpdateRoleDto): Promise<IUpdateRoleResDto> {
    try {
      const { roleId, workspaceId, name, permissions } = data;

      const role = await this._workspaceRoleRepository.findById(roleId);

      if (!role || role.workspaceId !== workspaceId) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      if (!role.isEditable) {
        throw new CustomError("Built in roles", STATUS_CODES.FORBIDDEN);
      }

      if (permissions) {
        const resolved = resolveDependencies(permissions);
        role.permissions = resolved;
      }

      if (name) {
        role.name = name;
        role.key = name.toLowerCase().trim();
      }

      await role.save();
      return role;
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.getRole",
      });
      throw error;
    }
  }

  async deleteRole(data: IDeleteRoleDto): Promise<void> {
    try {
      const { roleId, workspaceId } = data;

      const role = await this._workspaceRoleRepository.findById(roleId);

      if (!role || role.workspaceId !== workspaceId) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      if (!role.isDeletable) {
        throw new CustomError("Built in roles", STATUS_CODES.FORBIDDEN);
      }

      const memberRole = await this._workspaceRoleRepository.findOne({
        workspaceId,
        key: "member",
      });

      await this._workspaceRoleRepository.updateMany(
        { workspaceId, roleId },
        { roleId: String(memberRole?._id) }
      );

      role.isDeleted = true;
      await role.save();
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.getRole",
      });
      throw error;
    }
  }
}
