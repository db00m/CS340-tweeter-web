import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { Service } from "./Service";
import { PasswordUtil } from "./PasswordUtil";
import { UsersDAO } from "./interfaces/UsersDAO";
import { DAOFactory } from "./interfaces/DAOFactory";

export class UserService implements Service {

  private passwordUtil = new PasswordUtil();

  private dao: UsersDAO;

  constructor(daoFactory: DAOFactory) {
    this.dao = daoFactory.getUsersDAO();
  }

  public async getUser(
    authToken: string,
    alias: string
  ): Promise<User | null> {
    const user = await this.dao.getUser(alias);

    if (user === null) {
      throw Error(`User doesn't exist`);
    }

    return User.fromDto(user);
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Get User
    // TODO: Verify Password
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

    const user: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl: "" // TODO: should come from S3 storage
    };

    const passwordHash = await this.passwordUtil.hashPassword(password);

    await this.dao.putUser(user, passwordHash);
    // TODO: Login User

    return [User.fromDto(user), FakeData.instance.authToken]; // TODO: Should send real Auth token.
  };
}