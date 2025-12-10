import { FollowDto } from "tweeter-shared";

export interface FollowsDAO {
  createFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getPaginatedFollowers(followeeAlias: string, pageSize: number, lastAlias: string | undefined): Promise<[aliases: string[], hasMore: boolean]>;
  getPaginatedFollowees(followerAlias: string, pageSize: number, lastAlias: string | undefined): Promise<[aliases: string[], hasMore: boolean]>;
  getFollowerCount(followeeAlias: string): Promise<number>;
  getFolloweeCount(followerAlias: string): Promise<number>;
  getFollow(followerAlias: string, followeeAlias: string): Promise<FollowDto | null>;
  bulkCreateFollowsForFollowee(followeeAlias: string, followerAliases: string[]): Promise<void>;
}