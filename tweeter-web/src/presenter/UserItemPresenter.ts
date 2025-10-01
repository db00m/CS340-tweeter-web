import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";
import { Dispatch, SetStateAction } from "react";

export const PAGE_SIZE = 10;

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
  setHasMoreItems: Dispatch<SetStateAction<boolean>>;
}

export abstract class UserItemPresenter {
  private readonly _view: UserItemView;
  private readonly followService: FollowService;
  private readonly userService: UserService;

  private lastItem: User | null = null;

  private _userType = 'user';

  protected constructor(view: UserItemView) {
    this._view = view;
    this.followService = new FollowService();
    this.userService = new UserService();
  }

  protected get view() {
    return this._view;
  }

  protected set userType(userType: string) {
    this._userType = userType;
  }

  public reset() {
    this.view.setHasMoreItems(() => false);
    this.lastItem = null;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
    try {
      const [newItems, hasMore] = await this.followService.loadMoreUsers(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );


      this.view.setHasMoreItems(() => hasMore);
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this._userType}s because of exception: ${error}`
      );
    }
  };

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias)
  };
}