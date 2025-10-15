import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { PAGE_SIZE, PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export abstract class StatusItemPresenter extends PagedItemPresenter<Status> {
  private statusService: StatusService;

  protected constructor(view: PagedItemView<Status>) {
    super(view);
    this.statusService = new StatusService();
  }

  protected async getMoreItems(authToken: AuthToken, userAlias: string) {
    return this.statusService.loadMoreStatuses(
      authToken!,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}