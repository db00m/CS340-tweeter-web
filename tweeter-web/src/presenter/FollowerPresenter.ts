import { UserItemPresenter, UserItemView } from "./UserItemPresenter";


export class FollowerPresenter extends UserItemPresenter {

  public constructor(view: UserItemView) {
    super(view);
    this.userType = "follower";
  }

}