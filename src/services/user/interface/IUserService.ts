import {
  IChangePasswordDto,
  IGetMeDto,
  IListActiveSessionsDto,
  IListActiveSessionsResponseDto,
  IUpdatePasswordDto,
  IUpdateUserProfileDto,
  IUserListDto,
  IUserQueryDto,
} from "../../../interfaces/dtos/UserDTo";

export interface IUserService {
  getAllUsers(
    data: IUserQueryDto
  ): Promise<{ users: IUserListDto[]; totalCount: number }>;
  toggleBlockStatus(id: string): Promise<void>;
  updatePassword(data: IUpdatePasswordDto): Promise<void>;
  changePassword(data: IChangePasswordDto): Promise<void>;
  listActiveSessions(
    data: IListActiveSessionsDto
  ): Promise<IListActiveSessionsResponseDto[]>;
  updateProfile(data: IUpdateUserProfileDto): Promise<void>;
  getMe(data: IGetMeDto): Promise<IUserListDto>;
}
