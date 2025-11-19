import { StatusDto, UserDto } from "tweeter-shared";

export interface UsersDAO {
  getUser(userAlias: string): Promise<StatusDto | null>;
  createUser(user: UserDto): Promise<void>;
}