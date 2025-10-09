import { AuthToken, Status, User } from "tweeter-shared";
import { Dispatch, SetStateAction } from "react";
import { StatusService } from "../model.service/StatusService";

export interface PostView {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setPost: Dispatch<SetStateAction<string>>;
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => string;
  deleteMessage: (message: string) => void;
}

export class PostPresenter {
  private view: PostView;
  private statusService: StatusService;

  public constructor(view: PostView) {
    this.view = view;
    this.statusService = new StatusService();
  }

  submitPost = async (post: string, authToken: AuthToken, currentUser: User) => {
    let postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  };

  clearPost = () => {
    this.view.setPost("");
  };
}