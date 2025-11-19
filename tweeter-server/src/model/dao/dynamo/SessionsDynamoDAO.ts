import { SessionsDAO } from "../../service/interfaces/SessionsDAO";
import { AuthTokenDto, UserDto } from "tweeter-shared";

export class SessionsDynamoDAO implements SessionsDAO {
  createSession(userAlias: string, authToken: AuthTokenDto): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteSession(token: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getAuthorizedUser(token: string): Promise<UserDto | null> {
    return Promise.resolve(null);
  }

}