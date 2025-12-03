import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async ({ token, userAlias, pageSize, lastItem }: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());

  try {
    const [items, hasMore] = await followService.fetchFolloweesPage(token, userAlias, pageSize, lastItem);
    return {
      success: true,
      message: null,
      items,
      hasMore
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      items: [],
      hasMore: false
    }
  }
}