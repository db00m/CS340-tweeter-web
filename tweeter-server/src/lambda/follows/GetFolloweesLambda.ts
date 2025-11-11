import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async ({ token, userAlias, pageSize, lastItem }: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreUsers(token, userAlias, pageSize, lastItem);
  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}