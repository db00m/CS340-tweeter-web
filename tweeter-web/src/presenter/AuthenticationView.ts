import { Dispatch, SetStateAction } from "react";
import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";

export interface AuthenticationView {
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