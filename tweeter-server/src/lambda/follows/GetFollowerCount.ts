import { CountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async ({ token, userAlias }: TweeterRequest): Promise<CountResponse> => {
  const followService = new FollowService();

  return {
    success: true,
    message: null,
    count: await followService.getFollowerCount(token, userAlias)
  }
}