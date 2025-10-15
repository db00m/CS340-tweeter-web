import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";
import { Dispatch, SetStateAction } from "react";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
  setHasMoreItems: Dispatch<SetStateAction<boolean>>;
}

export abstract class UserItemPresenter extends Presenter<UserItemView> {
  private readonly followService: FollowService;
  private readonly userService: UserService;

  private lastItem: User | null = null;

  private _userType = 'user';

  protected constructor(view: UserItemView) {
    super(view);
    this.followService = new FollowService();
    this.userService = new UserService();
  }

  protected set userType(userType: string) {
    this._userType = userType;
  }

  public reset() {
    this.view.setHasMoreItems(() => false);
    this.lastItem = null;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.followService.loadMoreUsers(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.view.setHasMoreItems(() => hasMore);
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, `load ${this._userType}`)
  };

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias)
  };
}