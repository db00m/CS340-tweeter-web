import { FollowsDAO } from "../../service/interfaces/FollowsDAO";
import { FollowDto, UserDto } from "tweeter-shared";

export class FollowsDynamoDAO implements FollowsDAO {
  async createFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getFollow(followerAlias: string, followeeAlias: string): Promise<FollowDto | null> {
    return Promise.resolve(null);
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    return Promise.resolve(0);
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    return Promise.resolve(0);
  }

  async getPaginatedFollowees(followerAlias: string): Promise<[items: UserDto[], hasMore: boolean]> {
    return Promise.resolve([[], false]);
  }

  async getPaginatedFollowers(followeeAlias: string): Promise<[items: UserDto[], hasMore: boolean]> {
    return Promise.resolve([[], false]);
  }

}