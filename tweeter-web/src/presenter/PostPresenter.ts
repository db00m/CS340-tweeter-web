import { AuthToken, Status, User } from "tweeter-shared";
import { Dispatch, SetStateAction } from "react";
import { StatusService } from "../model.service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostView extends View {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setPost: Dispatch<SetStateAction<string>>;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (message: string) => void;
}

export class PostPresenter extends Presenter<PostView> {
  private statusService: StatusService;

  public constructor(view: PostView) {
    super(view);
    this.statusService = new StatusService();
  }

  submitPost = async (post: string, authToken: AuthToken, currentUser: User) => {
    let postingStatusToastId = "";

    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status")

    this.view.deleteMessage(postingStatusToastId);
    this.view.setIsLoading(false);
  };

  clearPost = () => {
    this.view.setPost("");
  };
}