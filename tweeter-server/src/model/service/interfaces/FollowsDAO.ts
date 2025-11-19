import { FollowDto, UserDto } from "tweeter-shared";

export interface FollowsDAO {
  createFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getPaginatedFollowers(followeeAlias: string, pageSize: number, lastItem: string): Promise<[items: UserDto[], hasMore: boolean]>;
  getPaginatedFollowees(followerAlias: string, pageSize: number, lastItem: string): Promise<[items: UserDto[], hasMore: boolean]>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  getFolloweeCount(followerAlias: string): Promise<number>;
  getFollow(followerAlias: string, followeeAlias: string): Promise<FollowDto | null>;
}