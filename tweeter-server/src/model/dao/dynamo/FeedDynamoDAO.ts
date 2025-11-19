import { FeedDAO } from "../../service/interfaces/FeedDAO";
import { StatusDto } from "tweeter-shared";

export class FeedDynamoDAO implements FeedDAO {
  addToFeed(feedOwnerAlias: string, status: StatusDto): Promise<void> {
    return Promise.resolve(undefined);
  }

  getPaginatedFeed(userAlias: string): Promise<StatusDto[]> {
    return Promise.resolve([]);
  }
}