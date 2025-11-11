import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
  // TODO: Should have separate methods when connected to database
  public async loadMoreUsers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    const [items, hasMore] =  FakeData.instance.getPageOfUsers(lastUser ? User.fromDto(lastUser) : null, pageSize, userAlias);
    return [items.map((item: User) => item.toDto()), hasMore];
  };

  async getIsFollowerStatus(
    authToken: AuthToken,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  async getFolloweeCount(
    authToken: AuthToken,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  async getFollowerCount(
    authToken: AuthToken,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  async follow(
    authToken: AuthToken,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  async unfollow(
    authToken: AuthToken,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };
}