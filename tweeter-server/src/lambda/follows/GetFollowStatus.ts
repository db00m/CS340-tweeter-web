import { FollowStatusRequest, FollowStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async ({ token, userAlias, selectedUser }: FollowStatusRequest): Promise<FollowStatusResponse> => {
  try {
    const followService = new FollowService(new DynamoDAOFactory());

    return {
      success: true,
      message: null,
      isFollower: await followService.getIsFollowerStatus(token, userAlias, selectedUser)
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      isFollower: false
    }
  }
}