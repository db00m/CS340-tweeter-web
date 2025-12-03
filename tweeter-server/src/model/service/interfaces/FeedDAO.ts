import { StatusDto } from "tweeter-shared";

export interface FeedDAO {
  getPaginatedFeed(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  batchAddToFeed(userAliases: string[], status: StatusDto): Promise<void>;
  addToFeed(feedOwnerAlias: string, status: StatusDto): Promise<void>;
}