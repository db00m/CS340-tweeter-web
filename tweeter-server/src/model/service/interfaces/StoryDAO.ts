import { StatusDto } from "tweeter-shared";

export interface StoryDAO {
  getPaginatedStory(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  addToStory(status: StatusDto): Promise<void>;
}