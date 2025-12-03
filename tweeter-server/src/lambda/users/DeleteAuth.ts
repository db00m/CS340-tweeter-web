import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { S3AvatarDAO } from "../../model/dao/s3/S3AvatarDAO";

export const handler = async ({ token }: TweeterRequest): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoDAOFactory(), new S3AvatarDAO());

  await userService.logout(token);

  return {
    success: true,
    message: null
  }
}