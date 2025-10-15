import { Dispatch, SetStateAction } from "react";
import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void,
  navigate: NavigateFunction;
}

export abstract class AuthenticationPresenter<T extends AuthenticationView> extends Presenter<T> {
  public async doAuthOperation(
    authOperation: () => Promise<[User, AuthToken]>,
    navOperation: (userAlias: string) => void,
    rememberMe: boolean,
    operationDescription: string): Promise<void> {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {

      const [user, authToken] = await authOperation();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      navOperation(user.alias);
    }, operationDescription);

    this.view.setIsLoading(false);
  };
}