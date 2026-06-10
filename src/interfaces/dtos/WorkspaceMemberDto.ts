export interface IListMemberDto {
  workspaceId: string;
}

export interface IListMemberResDto {
  memberId: string;
  userId: string
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  roleKey: string;
  joinedAt: Date;
}

export interface IUpdateMemberDto {
  workspaceId: string;
  memberId: string;
  roleId: string;
}

export interface IRemoveMemberDto {
  workspaceId: string;
  memberId: string;
}


