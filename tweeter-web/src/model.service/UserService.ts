import { AuthToken, CreateUserRequest, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User> {

    return this.serverFacade.getUser({ token: authToken.token, userAlias: alias });
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.login({ userAlias: "", token: "", password, alias });
  };

  public async logout(authToken: AuthToken): Promise<void> {

    await this.serverFacade.logout({ userAlias: "", token: authToken.token });
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {

    const request: CreateUserRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: Buffer.from(userImageBytes).toString("base64"),
      imageFileExtension,
      token: "",
      userAlias: "",
    }

    return this.serverFacade.register(request);
  };
}