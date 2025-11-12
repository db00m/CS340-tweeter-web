import { CreateAuthRequest, CreateAuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async ({ alias, password }: CreateAuthRequest): Promise<CreateAuthResponse> => {
  const userService = new UserService();

  try {
    const [user, authToken] = await userService.login(alias, password);

    return {
      success: true,
      message: null,
      user,
      authToken
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      user: null,
      authToken: null
    }
  }

}