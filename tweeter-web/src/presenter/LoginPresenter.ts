import { UserService } from "../model.service/UserService";
import { AuthenticationView } from "./AuthenticationView";

export class LoginPresenter {
  private readonly _view: AuthenticationView;
  private readonly _userService: UserService
  private readonly _originalUrl: string | undefined;

  public constructor(view: AuthenticationView, originalUrl: string | undefined) {
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