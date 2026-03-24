import { IUser } from "../../models/User";
import { IUserListDto } from "../dtos/UserDTo";

export class userDtoMapper {
  static toUserListDto(user: IUser): IUserListDto {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      isBlocked: user.isBlocked,
      avatarUrl: user?.avatarUrl,
    };
  }
}
