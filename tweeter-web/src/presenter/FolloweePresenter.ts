import { UserItemPresenter, UserItemView } from "./UserItemPresenter";


export class FolloweePresenter extends UserItemPresenter {

  public constructor(view: UserItemView) {
    super(view);
    this.userType = "followee";
  }

}