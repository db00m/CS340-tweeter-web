import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { SQSFeedQueueAdapter } from "../../model/dao/sqs/SQSFeedQueueAdapter";

export const handler = async ({ token, userAlias, pageSize, lastItem }: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory(), new SQSFeedQueueAdapter());

  const [items, hasMore] = await statusService.fetchFeedPage(token, userAlias, pageSize, lastItem)

  return {
    success: true,
    message: null,
    items,
    hasMore
  }
}