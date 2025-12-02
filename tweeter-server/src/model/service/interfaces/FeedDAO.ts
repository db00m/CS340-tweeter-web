import { StatusDto } from "tweeter-shared";

export interface FeedDAO {
  getPaginatedFeed(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  addToFeed(feedOwnerAlias: string, status: StatusDto): Promise<void>;
}