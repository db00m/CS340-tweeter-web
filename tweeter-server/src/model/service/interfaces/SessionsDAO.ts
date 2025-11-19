import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface SessionsDAO {
  getAuthorizedUser(token: string): Promise<UserDto | null>;
  createSession(userAlias: string, authToken: AuthTokenDto): Promise<void>;
  deleteSession(token: string): Promise<void>;
}