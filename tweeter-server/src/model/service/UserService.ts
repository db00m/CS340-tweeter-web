import { AuthToken, AuthTokenDto, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { PasswordService } from "./PasswordService";
import { UsersDAO } from "./interfaces/UsersDAO";
import { DAOFactory } from "./interfaces/DAOFactory";
import { SessionsDAO } from "./interfaces/SessionsDAO";
import { AuthenticationService } from "./AuthenticationService";
import { AvatarDAO } from "./interfaces/AvatarDAO";

export class UserService implements Service {

  private passwordService = new PasswordService();

  private dao: UsersDAO;
  private sessionsDAO: SessionsDAO;
  private avatarDAO: AvatarDAO;

  constructor(daoFactory: DAOFactory, avatarDAO: AvatarDAO) {
    this.dao = daoFactory.getUsersDAO();
    this.sessionsDAO = daoFactory.getSessionsDAO();
    this.avatarDAO = avatarDAO;
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
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {

    const existingUser = await this.dao.getUser(alias);

    if (existingUser) {
      throw new Error("Alias is not available");
    }

    let avatarUrl = ""

    if (userImageBytes.length > 0) {
      avatarUrl = await this.avatarDAO.uploadAvatar(userImageBytes, imageFileExtension, `${alias.slice(1)}.${imageFileExtension}`);
    }

    const userDto: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl: avatarUrl,
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