import { useCallback, useMemo, useState } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";
import { UserInfo } from "./UserInfo";

const CURRENT_USER_KEY: string = "CurrentUserKey";
const AUTH_TOKEN_KEY: string = "AuthTokenKey";

interface Props {
  children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const saveToLocalStorage = (
    currentUser: User,
    authToken: AuthToken
  ): void => {
    localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
    localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
  };

  const retrieveFromLocalStorage = (): UserInfo => {
    const loggedInUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
    const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));

    if (!!loggedInUser && !!authToken) {
      return {
        currentUser: loggedInUser,
        displayedUser: loggedInUser,
        authToken: authToken,
      };
    } else {
      return { currentUser: null, displayedUser: null, authToken: null };
    }
  };

  const clearLocalStorage = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const [userInfo, setUserInfo] = useState({
    ...retrieveFromLocalStorage(),
  });

  const updateUserInfo = useCallback(
    (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean = false
    ) => {
      setUserInfo(() => {
        return {
          currentUser: currentUser,
          displayedUser: displayedUser,
          authToken: authToken,
        };
      });

      if (remember) {
        saveToLocalStorage(currentUser, authToken);
      }
    },
    []
  );

  const clearUserInfo = useCallback(() => {
    setUserInfo(() => {
      return {
        currentUser: null,
        displayedUser: null,
        authToken: null,
      };
    });

    clearLocalStorage();
  }, []);

  const setDisplayedUser = useCallback((user: User) => {
    setUserInfo((previous) => {
      return { ...previous, displayedUser: user };
    });
  }, []);

  const userInfoActions = useMemo(
    () => ({
      updateUserInfo,
      clearUserInfo,
      setDisplayedUser,
    }),
    [updateUserInfo, clearUserInfo, setDisplayedUser]
  );

  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoActionsContext.Provider value={userInfoActions}>
        {children}
      </UserInfoActionsContext.Provider>
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
