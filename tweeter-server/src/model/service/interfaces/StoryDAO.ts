import { StatusDto } from "tweeter-shared";

export interface StoryDAO {
  getPaginatedStory(userAlias: string): Promise<StatusDto[]>;
  addToStory(userAlias: string, status: StatusDto): Promise<void>;
}