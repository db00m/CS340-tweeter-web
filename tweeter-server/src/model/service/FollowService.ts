import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
  public async loadMoreUsers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {

    const [items, hasMore] =  FakeData.instance.getPageOfUsers(lastUser ? User.fromDto(lastUser) : null, pageSize, userAlias);
    return [items.map((item: User) => item.toDto()), hasMore];
  };

  async getIsFollowerStatus(
    authToken: string,
    userAlias: string,
    selectedUser: UserDto
  ): Promise<boolean> {

    return FakeData.instance.isFollower();
  };

  async getFolloweeCount(
    authToken: string,
    userAlias: string
  ): Promise<number> {

    return FakeData.instance.getFolloweeCount(userAlias);
  };

  async getFollowerCount(
    authToken: string,
    userAlias: string
  ): Promise<number> {

    return FakeData.instance.getFollowerCount(userAlias);
  };

  async follow(
    authToken: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follows message. Remove when connected to the server

    const followerCount = await this.getFollowerCount(authToken, userAlias);
    const followeeCount = await this.getFolloweeCount(authToken, userAlias);

    return [followerCount, followeeCount];
  };

  async unfollow(
    authToken: string,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    const followerCount = await this.getFollowerCount(authToken, userAlias);
    const followeeCount = await this.getFolloweeCount(authToken, userAlias);

    return [followerCount, followeeCount];
  };
}