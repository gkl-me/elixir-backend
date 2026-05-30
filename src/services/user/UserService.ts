import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { CustomError } from "../../errors/CustomError";
import { AUTH_MESSAGES, CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { userDtoMapper } from "../../interfaces/mapper/userDtoMapper";
import { Token } from "../../di/token";
import { IUserService } from "./interface/IUserService";
import {
  IChangePasswordDto,
  IListActiveSessionsDto,
  IListActiveSessionsResponseDto,
  IUpdatePasswordDto,
  IUpdateUserProfileDto,
  IUserListDto,
  IUserQueryDto,
} from "../../interfaces/dtos/UserDTo";
import { IPasswordHasher } from "../../providers/interfaces/IPasswordHasher";
import logger from "../../middlewares/logger";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";
import { IAuthSession } from "../../interfaces/types/session.types";
import { REDIS_STORE } from "../../constants/redis/redisStore";
import { logError } from "../../middlewares/loggerHelper";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { de } from "zod/v4/locales";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Token.UserRepository) private _userRepository: IUserRepository,
    @inject(Token.PasswordHasher) private _passwordHasher: IPasswordHasher,
    @inject(Token.CacheRepository)
    private readonly _cacheRepository: ICacheRepository<IAuthSession>,
    @inject(Token.TokenManager) private _tokenManager: ITokenManager,
  ) {}

  async getAllUsers(
    data: IUserQueryDto,
  ): Promise<{ users: IUserListDto[]; totalCount: number }> {
    try {
      const { search, page, limit, sortBy, sortOrder, status } = data;

      const skip = (page - 1) * limit;
      const sort: Record<string, -1 | 1> = {};
      if (sortBy) {
        sort[sortBy] = sortOrder === -1 ? -1 : 1;
      }

      const allUsers = await this._userRepository.findAllUsers(
        {
          search,
          status,
        },
        {
          sort,
          skip,
          limit,
        },
      );

      const totalCount = await this._userRepository.findUsersCount();

      let mappedUsers = null;
      if (allUsers?.length) {
        mappedUsers = allUsers.map((user) => userDtoMapper.toUserListDto(user));
      }

      return {
        users: mappedUsers || [],
        totalCount,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async toggleBlockStatus(id: string): Promise<void> {
    try {
      const userFound = await this._userRepository.findById(id);
      if (!userFound)
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST,
        );

      //delete add exiting session for the user
      const sessionKey = REDIS_STORE.USER_SESSION + String(userFound._id);

      const sessionIds = await this._cacheRepository.getMembers(sessionKey);

      //delete individual sessions
      if (sessionIds.length > 0) {
        sessionIds.forEach(async (id) => {
          await this._cacheRepository.delete(REDIS_STORE.SESSION + id);
        });
      }

      //delete sessions
      await this._cacheRepository.delete(sessionKey);

      userFound.isBlocked = !userFound.isBlocked;
      await userFound.save();
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updatePassword(data: IUpdatePasswordDto): Promise<void> {
    try {
      const { email, newPassword } = data;

      const user = await this._userRepository.findByEmail(email);
      if (!user)
        throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

      const hashPassword = await this._passwordHasher.hashPassword(newPassword);
      if (user) {
        user.password = hashPassword;
        await user.save();
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async changePassword(data: IChangePasswordDto): Promise<void> {
    try {

      const {newPassword,currentPassword,userId} = data

      const user = await this._userRepository.findById(userId)

      if(!user){
        throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND)
      }

      // const verifyPassword = await this._passwordHasher.comparePasswords(currentPassword,user.password)

      // if(!verifyPassword){
      //   throw new CustomError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED)
      // }

      const hashPassword = await this._passwordHasher.hashPassword(newPassword);
      user.password = hashPassword
      await user.save()
      

    } catch (error) {
      logError(error,{
        service:"UserService.changePassword",
      })
      throw error
    }
  }

  async listActiveSessions(data:IListActiveSessionsDto): Promise<IListActiveSessionsResponseDto[]> {
    try {

      const {userId,accessToken} = data

      const decodedToken = this._tokenManager.decodeToken(accessToken)

      const currentSession = await this._cacheRepository.get(REDIS_STORE.SESSION + decodedToken.sessionId)
      
      const sessionKey = REDIS_STORE.USER_SESSION + String(userId);

      const sessionIds = await this._cacheRepository.getMembers(sessionKey);

      // Fetch details for each session ID
      const activeSessions:IListActiveSessionsResponseDto[] = [];
      for (const id of sessionIds) {
        const session = await this._cacheRepository.get(REDIS_STORE.SESSION + id);
        if (session && id !== decodedToken.sessionId) {
          activeSessions.push({
            ...session,
            isCurrentSession: false
          });
        }else if(session && id === decodedToken.sessionId){
          activeSessions.push({
            ...session,
            isCurrentSession: true
          })
        }
      }


      return activeSessions

    } catch (error) {
      logError(error,{
        service:"UserService.listActiveSessions",
      })
      throw error
    }
  }


  async updateProfile(data: IUpdateUserProfileDto): Promise<void> {
    try {

      const {name,bio,jobTitle,userId}  = data

      const user = await this._userRepository.update(userId,{
        name,
        bio,
        jobTitle
      })
      
    } catch (error) {
      logError(error,{
        service:"UserService.updateProfile",
      })
      throw error
    }
  }
}
