import { UserItemPresenter } from "./UserItemPresenter";
import { PagedItemView } from "./PagedItemPresenter";
import { User } from "tweeter-shared";

export class FolloweePresenter extends UserItemPresenter {

  public constructor(view: PagedItemView<User>) {
    super(view);
  }

  protected itemDescription(): string {
    return "followee";
  }

}