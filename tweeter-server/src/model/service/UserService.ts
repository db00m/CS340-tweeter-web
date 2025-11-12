import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser(
    authToken: string,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.toDto(), FakeData.instance.authToken.toDto()];
  };

  public async logout(authToken: string): Promise<void> {
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {

    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  };
}