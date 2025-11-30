import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async ({ token }: TweeterRequest): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoDAOFactory());

  await userService.logout(token);

  return {
    success: true,
    message: null
  }
}