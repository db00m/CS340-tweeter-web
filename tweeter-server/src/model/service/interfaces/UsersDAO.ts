import { StatusDto, UserDto } from "tweeter-shared";

export interface UsersDAO {
  getUser(userAlias: string): Promise<UserDto | null>;
  bulkGetUsers(userAliases: string[]): Promise<UserDto[]>
  putUser(user: UserDto, passwordHash: string): Promise<void>;
  bulkPutUsers(users: UserDto[]): Promise<void>;
}