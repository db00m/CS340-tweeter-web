import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";

export const PAGE_SIZE = 10;

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserItemPresenter {
  private readonly _view: UserItemView;
  private readonly followService: FollowService;
  private readonly userService: UserService;

  private lastItem: User | null = null;
  private _hasMoreItems: boolean = true;

  private userType = 'user';

  public constructor(view: UserItemView, userType: string) {
    this._view = view;
    this.followService = new FollowService();
    this.userService = new UserService();
    this.userType = userType;
  }

  protected get view() {
    return this._view;
  }

  public reset() {
    this._hasMoreItems = true;
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


      this._hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this.userType}s because of exception: ${error}`
      );
    }
  };

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias)
  };

  public get hasMoreItems() {
    return this._hasMoreItems;
  }
}