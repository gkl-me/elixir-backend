import { IUser } from "../../models/User";
import { IAuthResponseDto } from "../dtos/AuthDTO";

export class authDtoMapper {
  static toAuthResponse(
    user: IUser,
    accessToken: string,
    refreshToken: string
  ): IAuthResponseDto {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user?.role,
      accessToken,
      refreshToken,
    };
  }
}
