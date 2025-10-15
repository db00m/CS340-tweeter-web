import { Dispatch, SetStateAction } from "react";
import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { View } from "./Presenter";

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