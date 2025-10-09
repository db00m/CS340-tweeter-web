import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { PAGE_SIZE } from "../components/mainLayout/StatusScroller";
import { StatusService } from "../model.service/StatusService";
import { Dispatch, SetStateAction } from "react";
import { UserService } from "../model.service/UserService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
  setHasMoreItems: Dispatch<SetStateAction<boolean>>;
}

export abstract class StatusItemPresenter {
  private statusService: StatusService;
  private userService: UserService;
  private view: StatusItemView;

  private _itemDescription: string = '';
  private lastItem: Status | null = null;

  protected constructor(view: StatusItemView) {
    this.statusService = new StatusService();
    this.userService = new UserService();
    this.view = view;
  }

  async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  };

  async loadMoreItems (authToken: AuthToken, userAlias: string): Promise<void> {
    try {
      const [newItems, hasMore] = await this.statusService.loadMoreStatuses(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.view.setHasMoreItems(() => hasMore);
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this._itemDescription} items because of exception: ${error}`
      );
    }
  };

  reset(){
    // this.view.setItems(() => []);  TODO: need to see if this is actually needed
    this.lastItem = null;
    this.view.setHasMoreItems(() => true);
  };

  protected set itemDescription (itemDescription: string) {
    this._itemDescription = itemDescription;
  }
}