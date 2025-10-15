import { Dispatch, SetStateAction } from "react";
import { Presenter, View } from "./Presenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
  setHasMoreItems: Dispatch<SetStateAction<boolean>>;
}

export abstract class PagedItemPresenter<T> extends Presenter<PagedItemView<T>> {
  private _lastItem: T | null = null;
  private userService = new UserService();

  async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  };

  reset(){
    this.lastItem = null;
    this.view.setHasMoreItems(() => true);
  };

  public get lastItem() {
    return this._lastItem;
  }

  public set lastItem(value: T | null) {
    this._lastItem = value;
  }

  async loadMoreItems (authToken: AuthToken, userAlias: string): Promise<void> {
    await this.doFailureReportingOperation(async () =>  {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.view.setHasMoreItems(() => hasMore);
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, `load ${this.itemDescription()}`);
  };

  protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;
  protected abstract itemDescription(): string;
}