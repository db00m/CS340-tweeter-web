import { UserService } from "../model.service/UserService";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  private readonly _userService: UserService
  private readonly _originalUrl: string | undefined;

  public constructor(view: AuthenticationView, originalUrl: string | undefined) {
    super(view);
    this._userService = new UserService();
    this._originalUrl = originalUrl;
  }

  public async doLogin(rememberMe: boolean, alias: string, password: string) {
    await this.doAuthOperation(async () => {
      return this._userService.login(alias, password);
    },
      (alias: string) => {
        if (!!this._originalUrl) {
          this.view.navigate(this._originalUrl);
        } else {
          this.view.navigate(`/feed/${alias}`);
        }
      }, rememberMe, "log user in")
  };
}