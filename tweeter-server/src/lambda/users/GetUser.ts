import { GetUserResponse, TweeterRequest, TweeterResponse, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { AuthenticationService } from "../../model/service/AuthenticationService";
import { SessionsDynamoDAO } from "../../model/dao/dynamo/SessionsDynamoDAO";

export const handler = async ({ token, userAlias }: TweeterRequest): Promise<GetUserResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  const authenticationService = new AuthenticationService(new SessionsDynamoDAO());

  try {
    await authenticationService.authenticate(token);

    const user: User | null = await userService.getUser(userAlias);

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
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      user: null
    }
  }


}