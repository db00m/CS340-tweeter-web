import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  async loadMoreStatuses(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
    statusType: "feed" | "story"
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getStatuses(statusType, { token: authToken.token, userAlias, pageSize, lastItem: lastItem ? lastItem.toDto() : null })
  }

  async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    return this.serverFacade.postStatus({ token: authToken.token, newStatus: newStatus.toDto(), userAlias: "" })
  };
}