import { StatusDto } from "tweeter-shared";

export interface FeedDAO {
  getPaginatedFeed(userAlias: string): Promise<StatusDto[]>;
  addToFeed(feedOwnerAlias: string, status: StatusDto): Promise<void>;
}