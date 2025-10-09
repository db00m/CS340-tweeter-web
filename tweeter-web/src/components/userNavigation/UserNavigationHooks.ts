import {useUserInfo, useUserInfoActions} from "../userInfo/UserInfoHooks";
import {useMessageActions} from "../toaster/MessageHooks";
import {useNavigate} from "react-router-dom";
import { NavigationPresenter, NavigationView } from "../../presenter/NavigationPresenter";

export const useUserNavigation = () => {
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();

  const listener: NavigationView = {
    setDisplayedUser,
    displayErrorMessage,
    navigate,
  }
  const presenter = new NavigationPresenter(listener);

  return async (event: React.MouseEvent, featurePath: string): Promise<void> => {
    event.preventDefault();

    await presenter.navigateToUser(featurePath, event.target!.toString(), authToken!, displayedUser!)
  };
}