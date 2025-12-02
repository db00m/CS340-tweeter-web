import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { Service } from "./Service";
import { PasswordService } from "./PasswordService";
import { UsersDAO } from "./interfaces/UsersDAO";
import { DAOFactory } from "./interfaces/DAOFactory";
import { SessionsDAO } from "./interfaces/SessionsDAO";
import { AuthenticationService } from "./AuthenticationService";

export class UserService implements Service {

  private passwordService = new PasswordService();

  private dao: UsersDAO;
  private sessionsDAO: SessionsDAO;

  constructor(daoFactory: DAOFactory) {
    this.dao = daoFactory.getUsersDAO();
    this.sessionsDAO = daoFactory.getSessionsDAO();
  }

  public async getUser(
    alias: string
  ): Promise<User> {
    const userDto: UserDto | null = await this.getUserDto(alias);

    if (!userDto) {
      throw Error('User not found');
    }

    return User.fromDto(userDto);
  };

  private async getUserDto(
    alias: string
  ): Promise<UserDto | null> {
    return await this.dao.getUser(alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDto = await this.getUserDto(alias);

    if (!userDto || (userDto.passwordHash && !await this.passwordService.checkPassword(password, userDto.passwordHash))) {
      throw new Error("Invalid alias or password");
    }

    return [userDto, await this.createSession(alias)];
  };

  public async logout(authToken: string): Promise<void> {
    await this.sessionsDAO.deleteSession(authToken);
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string, // TODO: Shouldn't need this on the server
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {

    const userDto: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl: "" // TODO: should come from S3 storage
    };

    const passwordHash = await this.passwordService.hashPassword(password);

    await this.dao.putUser(userDto, passwordHash);

    return [userDto, await this.createSession(alias)];
  };

  private async createSession(alias: string): Promise<AuthTokenDto> {
    const authToken = AuthToken.Generate().toDto();

    await this.sessionsDAO.createSession(alias, authToken);

    return authToken;
  }
}