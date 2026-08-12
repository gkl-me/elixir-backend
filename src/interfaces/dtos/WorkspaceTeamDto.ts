export interface ICreateTeamDto {
  workspaceId: string;
  name: string;
  description?: string;
  memberIds: string[];
  createdByUserId: string;
}

export interface IAddMembersDto {
  teamId: string;
  memberIds: string[];
  workspaceId: string;
}

export interface IRemoveMemberDto {
  workspaceId: string;
  teamId: string;
  memberId: string;
}

export interface IListTeamsDto {
  workspaceId: string;
  page: number;
  limit: number;
  search: string;
}

export interface IGetTeamDto {
  workspaceId: string;
  teamId: string;
}

export interface IGetTeamResDto {
  id: string;
  name: string;
  description?: string;
  members: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
  }[];
}

export interface IListTeamsDetails {
  id: string;
  name: string;
  memberCount: number;
  memberName: string[];
}

export interface IListTeamsResDto {
  teams: IListTeamsDetails[];
  totalCount: number;
}


export interface IGetUniqueTeamMembers {
  workspaceId: string,
  teamIds: string[],
  search?: string
}


export interface TeamMembersDto {
  id: string,
  name: string,
  email: string,
  avatarUrl?: string,
  role: string
}