import { FollowActionResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async ({ token, userAlias }: TweeterRequest): Promise<FollowActionResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());

  const [followerCount, followeeCount] = await followService.unfollow(token, userAlias);

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount,
  }
}