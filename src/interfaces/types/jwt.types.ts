import { JwtPayload } from "jsonwebtoken";

export interface IAccessTokenPayload extends JwtPayload {
  userId: string;
  role: string;
  sessionId: string;
}

export interface IRefreshTokenPayload extends JwtPayload {
  userId: string;
  role: string;
  sessionId: string;
  tokenVersion: number;
}
