import {useContext} from "react";
import {UserInfoActionsContext, UserInfoContext} from "./UserInfoContexts"

export const useUserInfo = () => {
  return useContext(UserInfoContext);
}

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext)
}