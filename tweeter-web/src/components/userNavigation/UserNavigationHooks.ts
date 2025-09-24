import {useUserInfo, useUserInfoActions} from "../userInfo/UserInfoHooks";
import {useMessageActions} from "../toaster/MessageHooks";
import {AuthToken, FakeData, User} from "tweeter-shared";
import {useNavigate} from "react-router-dom";

export const useUserNavigation = () => {
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return async (event: React.MouseEvent, featurePath: string): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());
      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  };
}