import { CountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async ({ token, userAlias }: TweeterRequest): Promise<CountResponse> => {

  try {
    const followService = new FollowService(new DynamoDAOFactory());

    return {
      success: true,
      message: null,
      count: await followService.getFolloweeCount(token, userAlias)
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      count: 0
    }
  }
}