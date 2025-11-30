import { StatusDto, UserDto } from "tweeter-shared";

export interface UsersDAO {
  getUser(userAlias: string): Promise<UserDto | null>;
  putUser(user: UserDto, passwordHash: string): Promise<void>;
}