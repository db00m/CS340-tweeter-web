import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async ({ token }: TweeterRequest): Promise<TweeterResponse> => {
  const userService = new UserService()

  await userService.logout(token);

  return {
    success: true,
    message: null
  }
}