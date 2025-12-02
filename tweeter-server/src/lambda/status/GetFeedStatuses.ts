import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async ({ token, userAlias, pageSize, lastItem }: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());

  const [items, hasMore] = await statusService.loadMoreStatuses(token, userAlias, pageSize, lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}