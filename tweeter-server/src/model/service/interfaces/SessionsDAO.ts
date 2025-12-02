import { AuthTokenDto, SessionDto, UserDto } from "tweeter-shared";

export interface SessionsDAO {
  getSession(token: string): Promise<SessionDto | null>;
  createSession(userAlias: string, authToken: AuthTokenDto): Promise<void>;
  deleteSession(token: string): Promise<void>;
}