import { UserService } from "../model.service/UserService";
import { AuthenticationView } from "./AuthenticationView";
import { Presenter } from "./Presenter";

export class LoginPresenter extends Presenter<AuthenticationView> {
  private readonly _userService: UserService
  private readonly _originalUrl: string | undefined;

  public constructor(view: AuthenticationView, originalUrl: string | undefined) {
    super(view);
    this._userService = new UserService();
    this._originalUrl = originalUrl;
  }

  public async doLogin(rememberMe: boolean, alias: string, password: string) {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {

      const [user, authToken] = await this._userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this._originalUrl) {
        this.view.navigate(this._originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    }, "log user in")

    this.view.setIsLoading(false);
  };
}