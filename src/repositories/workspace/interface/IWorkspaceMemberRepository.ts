import { IWorkspaceMember } from "../../../models/WorkspaceMember";
import { BaseRepository } from "../../base/BaseRepository";

export interface IWorkspaceMemberWithUser {
  _id: string;
  workspaceId: string;
  userId: string;
  roleId: string;
  isRemoved: boolean;
  invitedByUserId: string;
  joinedAt?: Date;

  user: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    isVerified: boolean;
  };

  role: {
    _id: string;
    workspaceId: string;
    key: string;
    name: string;
  };
}

export interface IUserWorkspace {
  _id: string,
  name: string,
  slug: string,
  isActive: boolean,

}

export interface IWorkspaceMemberRepository extends BaseRepository<IWorkspaceMember> {
  listMembers(workspaceId: string): Promise<IWorkspaceMemberWithUser[] | []>;
  listUserWorkspace(userId: string): Promise<IUserWorkspace[] | []>;
}
