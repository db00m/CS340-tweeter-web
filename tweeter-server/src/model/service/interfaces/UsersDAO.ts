import { StatusDto, UserDto } from "tweeter-shared";

export interface UsersDAO {
  getUser(userAlias: string): Promise<StatusDto | null>;
  putUser(user: UserDto, passwordHash: string): Promise<void>;
}