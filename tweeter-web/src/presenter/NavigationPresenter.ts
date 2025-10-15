import { UserService } from "../model.service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface NavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: NavigateFunction;
}

export class NavigationPresenter extends Presenter<NavigationView> {
  private userService: UserService;

  public constructor(view: NavigationView) {
    super(view);
    this.userService = new UserService();
  }

  async navigateToUser(featurePath: string, rawAlias: string, authToken: AuthToken, displayedUser: User): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(rawAlias);
      const toUser = await this.userService.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user")
  }

  private extractAlias (value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}