import { UserService } from "../model.service/UserService";
import { AuthToken } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";

export interface NavBarView {
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigate: NavigateFunction
}

export class NavBarPresenter {
  private view: NavBarView;
  private userService: UserService;

  public constructor(view: NavBarView) {
    this.view = view;
    this.userService = new UserService();
  }

  async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };
}