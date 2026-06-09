import { IUser } from "../../models/User";
import { IAuthResponseDto } from "../dtos/AuthDTO";

export class authDtoMapper {
  static toAuthResponse(
    user: IUser,
    workspace: {
      id: string;
      name: string;
      slug: string;
      memberId: string | null;
      roleId: string | null;
      isOwner: boolean;
    } | null,
    accessToken: string,
    refreshToken: string
  ): IAuthResponseDto {
    return {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || null
      },
      workspace: workspace ?? null,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }
}
