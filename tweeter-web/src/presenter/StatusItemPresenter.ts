import { AuthToken, Status, User } from "tweeter-shared";
import { PAGE_SIZE } from "../components/mainLayout/StatusScroller";
import { StatusService } from "../model.service/StatusService";
import { Dispatch, SetStateAction } from "react";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
  setHasMoreItems: Dispatch<SetStateAction<boolean>>;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private statusService: StatusService;
  private userService: UserService;

  private _itemDescription: string = '';
  private lastItem: Status | null = null;

  protected constructor(view: StatusItemView) {
    super(view);
    this.statusService = new StatusService();
    this.userService = new UserService();
  }

  async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  };

  async loadMoreItems (authToken: AuthToken, userAlias: string): Promise<void> {
    await this.doFailureReportingOperation(async () =>  {
      const [newItems, hasMore] = await this.statusService.loadMoreStatuses(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.view.setHasMoreItems(() => hasMore);
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, `load ${this._itemDescription}`);
  };

  reset(){
    this.lastItem = null;
    this.view.setHasMoreItems(() => true);
  };

  protected set itemDescription (itemDescription: string) {
    this._itemDescription = itemDescription;
  }
}