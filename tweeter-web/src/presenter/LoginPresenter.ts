import { Dispatch, SetStateAction } from "react";
import { UserService } from "../model.service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";

export interface LoginView {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void,
  navigate: NavigateFunction,
  displayErrorMessage: (message: string) => void
}

export class LoginPresenter {
  private readonly _view: LoginView;
  private readonly _userService: UserService
  private readonly _originalUrl: string | undefined;

  public constructor(view: LoginView, originalUrl: string | undefined) {
    this._view = view;
    this._userService = new UserService();
    this._originalUrl = originalUrl;
  }

  public async doLogin(rememberMe: boolean, alias: string, password: string) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this._userService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this._originalUrl) {
        this._view.navigate(this._originalUrl);
      } else {
        this._view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._view.setIsLoading(false);
    }
  };
}