import { UserService } from "../model.service/UserService";
import { AuthToken } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface NavBarView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigate: NavigateFunction
}

export class NavBarPresenter extends Presenter<NavBarView> {
  private _userService: UserService;

  public constructor(view: NavBarView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  };
}