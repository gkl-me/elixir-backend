import { ENV } from "../constants/env";
import axios, { AxiosInstance } from "axios";
import logger from "../middlewares/logger";
import { CustomError } from "../errors/CustomError";
import { CONSTANT_MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import { IGithubAuthService } from "./interfaces/IGithubAuthService";
import { injectable } from "tsyringe";

@injectable()
export class GithubAuthService implements IGithubAuthService {
  private readonly _baseUrl = ENV.GITHUB_BASE_URL;

  private _createClient(accessToken: string): AxiosInstance {
    return axios.create({
      baseURL: this._baseUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  }

  async getGithubUser(accessToken: string): Promise<void> {
    try {
      const client = this._createClient(accessToken);

      await client.get("/user");
      return;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyGithubUser(accessToken: string): Promise<
    [
      {
        email: string;
        primary: boolean;
        verified: boolean;
      },
    ]
  > {
    try {
      const client = this._createClient(accessToken);

      const { data } = await client.get("/user/emails");
      return data;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
