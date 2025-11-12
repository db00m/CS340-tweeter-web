import { AuthToken, FakeData, Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
  async loadMoreStatuses(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [statuses, hasMore]: [Status[], boolean] = FakeData.instance.getPageOfStatuses(lastItem ? Status.fromDto(lastItem) : null, pageSize);
    return [statuses.map((status) => status.toDto()), hasMore]
  }

  async postStatus(
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {
    // Code to post status
  };
}