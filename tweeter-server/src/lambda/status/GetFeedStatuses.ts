import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async ({ token, userAlias, pageSize, lastItem }: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();

  const [items, hasMore] = await statusService.loadMoreStatuses(token, userAlias, pageSize, lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}