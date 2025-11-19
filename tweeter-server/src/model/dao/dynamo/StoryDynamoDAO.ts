import { StoryDAO } from "../../service/interfaces/StoryDAO";
import { StatusDto } from "tweeter-shared";

export class StoryDynamoDAO implements StoryDAO {
  addToStory(userAlias: string, status: StatusDto): Promise<void> {
    return Promise.resolve(undefined);
  }

  getPaginatedStory(userAlias: string): Promise<StatusDto[]> {
    return Promise.resolve([]);
  }
}