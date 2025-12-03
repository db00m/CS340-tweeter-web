import { AuthToken, FollowStatusRequest, PagedUserItemRequest, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service {
  private readonly serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreUsers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null,
    userType: "follower" | "followee"
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastUser ? lastUser.toDto() : null
    }

    return this.serverFacade.getUsers(userType, request);
  };

  async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: FollowStatusRequest = {
      token: authToken.token,
      userAlias: user.alias,
      selectedUser: selectedUser.toDto()
    }

    return this.serverFacade.getFollowStatus(request);
  };

  async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.serverFacade.getFolloweeCount({ token: authToken.token, userAlias: user.alias });
  };

  async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.serverFacade.getFollowerCount({ token: authToken.token, userAlias: user.alias });
  };

  async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {

    return this.serverFacade.createFollow({ token: authToken.token, userAlias: userToFollow.alias });
  };

  async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    return this.serverFacade.deleteFollow({ token: authToken.token, userAlias: userToUnfollow.alias })
  };
}