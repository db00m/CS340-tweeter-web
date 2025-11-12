import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { PAGE_SIZE, PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export abstract class UserItemPresenter extends PagedItemPresenter<User> {
  private readonly followService: FollowService;

  protected constructor(view: PagedItemView<User>) {
    super(view);
    this.followService = new FollowService();
  }

  protected async getMoreItems(authToken: AuthToken, userAlias: string) {
    return await this.followService.loadMoreUsers(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem,
      this.itemDescription() as ("follower" | "followee")
    );
  }
}