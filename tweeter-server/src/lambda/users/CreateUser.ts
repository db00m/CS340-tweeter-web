import { CreateAuthResponse, CreateUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { User } from "tweeter-shared";

export const handler = async (
  { firstName, lastName, alias, password, userImageBytes, imageFileExtension }: CreateUserRequest
): Promise<CreateAuthResponse> => {
  const userService = new UserService();

  try {
    const [user, authToken] = await userService.register(firstName, lastName, alias, password, userImageBytes, imageFileExtension);
    return {
      success: true,
      message: null,
      user: user.toDto(),
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