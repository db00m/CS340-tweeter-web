import { FollowService } from "../model.service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { Dispatch, SetStateAction } from "react";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
  setFollowerCount: Dispatch<SetStateAction<number>>;
  setFolloweeCount: Dispatch<SetStateAction<number>>;
  setIsFollower: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (message: string) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {

  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower status")
  };

  async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));

    }, "get followers count");
  };

  async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
    }, "get followees count")
  };

  async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    let followingUserToast = "";

    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");

    this.view.deleteMessage(followingUserToast);
    this.view.setIsLoading(false);
  };

  async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {

    let unfollowingUserToast = "";

    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");

    this.view.deleteMessage(unfollowingUserToast);
    this.view.setIsLoading(false);
  };
}