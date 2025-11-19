import { UsersDAO } from "../../service/interfaces/UsersDAO";
import { StatusDto, UserDto } from "tweeter-shared";

export class UsersDynamoDAO implements UsersDAO {
  createUser(user: UserDto): Promise<void> {
    return Promise.resolve(undefined);
  }

  getUser(userAlias: string): Promise<StatusDto | null> {
    return Promise.resolve(null);
  }
}