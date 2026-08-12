export interface IListMemberDto {
  workspaceId: string;
  search?: string;
  limit: number;
  page: number;
}

export interface IListMemberDetils {
  memberId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  roleKey: string;
  joinedAt: Date;
}

export interface IListMemberResDto {
  members: IListMemberDetils[] | [];
  totalCount: number;
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
