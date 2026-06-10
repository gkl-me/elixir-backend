export interface IUserListDto {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  avatarUrl?: string;
  bio?: string;
  jobTitle?: string;
}

export interface IUserQueryDto {
  search: string;
  sortBy: string;
  sortOrder: number;
  status: string;
  page: number;
  limit: number;
}

export interface IUpdatePasswordDto {
  newPassword: string;
  email: string;
}

export interface IChangePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface IListActiveSessionsDto {
  userId: string;
  accessToken: string;
}

export interface IListActiveSessionsResponseDto {
  userId: string;
  refreshTokenHash: string;
  tokenVersion: number;
  userAgent?: string;
  ip?: string;
  createdAt: number;
  expiresAt: number;
  isCurrentSession: boolean;
}

export interface IUpdateUserProfileDto {
  name: string;
  jobTitle: string;
  bio: string;
  userId: string;
}

export interface IGetMeDto {
  userId: string;
}
