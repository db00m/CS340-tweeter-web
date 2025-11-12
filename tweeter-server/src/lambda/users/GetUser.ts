import { GetUserResponse, TweeterRequest, TweeterResponse, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async ({ token, userAlias }: TweeterRequest): Promise<GetUserResponse> => {
  const userService = new UserService();

  const user: User | null = await userService.getUser(token, userAlias);

  if (!user) {
    return {
      success: false,
      message: "No user found",
      user: null
    }
  }

  return {
    success: true,
    message: null,
    user: user.toDto()
  }
}