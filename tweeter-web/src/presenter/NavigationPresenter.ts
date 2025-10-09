import { UserService } from "../model.service/UserService";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";

export interface NavigationView {
  setDisplayedUser: (user: User) => void;
  navigate: NavigateFunction;
  displayErrorMessage: (message: string) => void;
}

export class NavigationPresenter {
  private userService: UserService;
  private view: NavigationView;

  public constructor(view: NavigationView) {
    this.userService = new UserService();
    this.view = view;
  }

  async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  };

  async navigateToUser(featurePath: string, rawAlias: string, authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      const alias = this.extractAlias(rawAlias);
      const toUser = await this.userService.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  private extractAlias (value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}