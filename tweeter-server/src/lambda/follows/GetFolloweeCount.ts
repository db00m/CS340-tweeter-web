import { CountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async ({ token, userAlias }: TweeterRequest): Promise<CountResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());

  return {
    success: true,
    message: null,
    count: await followService.getFolloweeCount(token, userAlias)
  }
}