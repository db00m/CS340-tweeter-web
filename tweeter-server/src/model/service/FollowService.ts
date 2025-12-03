import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "./interfaces/DAOFactory";
import { FollowsDAO } from "./interfaces/FollowsDAO";
import { SessionsDAO } from "./interfaces/SessionsDAO";
import { AuthenticationService } from "./AuthenticationService";
import { UsersDAO } from "./interfaces/UsersDAO";

export class FollowService implements Service {

  private followsDAO: FollowsDAO;
  private usersDAO: UsersDAO;
  private authenticationService: AuthenticationService;

  constructor(daoFactory: DAOFactory) {
    this.followsDAO = daoFactory.getFollowsDAO();
    this.usersDAO = daoFactory.getUsersDAO();
    this.authenticationService = new AuthenticationService(daoFactory.getSessionsDAO());
  }

  public async loadMoreUsers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {

    const [items, hasMore] =  FakeData.instance.getPageOfUsers(lastUser ? User.fromDto(lastUser) : null, pageSize, userAlias);
    return [items.map((item: User) => item.toDto()), hasMore];
  };

  public async fetchFollowersPage(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]>  {
    await this.authenticationService.authenticate(authToken)

    const [aliases, hasMore] = await this.followsDAO.getPaginatedFollowers(userAlias, pageSize, lastUser?.alias);

    if (aliases.length === 0) {
      return [[], false];
    }

    const users = await this.usersDAO.bulkGetUsers(aliases);
    return [users, hasMore];
  }

  public async fetchFolloweesPage(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authenticationService.authenticate(authToken)

    const [aliases, hasMore] = await this.followsDAO.getPaginatedFollowees(userAlias, pageSize, lastUser?.alias);

    if (aliases.length === 0) {
      return [[], false];
    }

    const users = await this.usersDAO.bulkGetUsers(aliases);
    return [users, hasMore];
  }

  async getIsFollowerStatus(
    authToken: string,
    userAlias: string,
    selectedUser: UserDto
  ): Promise<boolean> {

    await this.authenticationService.authenticate(authToken);
    const follow = await this.followsDAO.getFollow(userAlias, selectedUser.alias);

    return !!follow;
  };

  async getFolloweeCount(
    authToken: string,
    userAlias: string
  ): Promise<number> {

    await this.authenticationService.authenticate(authToken);

    return await this.followsDAO.getFolloweeCount(userAlias);
  };

  async getFollowerCount(
    authToken: string,
    userAlias: string
  ): Promise<number> {

    await this.authenticationService.authenticate(authToken);

    return await this.followsDAO.getFollowerCount(userAlias);
  };

  async follow(
    authToken: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {

    const currentUserAlias = await this.authenticationService.authenticate(authToken);

    await this.followsDAO.createFollow(currentUserAlias, userAlias);

    const followerCount = await this.getFollowerCount(authToken, currentUserAlias);
    const followeeCount = await this.getFolloweeCount(authToken, currentUserAlias);

    return [followerCount, followeeCount];
  };

  async unfollow(
    authToken: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    const currentUserAlias = await this.authenticationService.authenticate(authToken);

    await this.followsDAO.deleteFollow(currentUserAlias, userAlias);

    const followerCount = await this.getFollowerCount(authToken, userAlias);
    const followeeCount = await this.getFolloweeCount(authToken, userAlias);

    return [followerCount, followeeCount];
  };
}